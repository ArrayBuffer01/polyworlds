package main

import (
	"bufio"
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"image/png"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	. "github.com/fogleman/fauxgl"
	"github.com/nfnt/resize"
)

// ---------------------------------------------------------------------
// Everything below this line (AvatarMesh, LoadAvatarOBJ, parseIndex) is
// unchanged from your original — the OBJ parsing/material-splitting logic
// stays exactly as you wrote it.
// ---------------------------------------------------------------------

type AvatarMesh struct {
	Parts map[string]*Mesh
}

func (a *AvatarMesh) BiUnitCube() {
	combined := NewEmptyMesh()

	for _, mesh := range a.Parts {
		combined.Add(mesh)
	}

	matrix := combined.BiUnitCube()

	for _, mesh := range a.Parts {
		mesh.Transform(matrix)
	}
}

func (a *AvatarMesh) SmoothNormalsThreshold(radians float64) {
	for _, mesh := range a.Parts {
		mesh.SmoothNormalsThreshold(radians)
	}
}

func parseIndex(value string, length int) int {
	parsed, _ := strconv.ParseInt(value, 0, 0)
	n := int(parsed)
	if n < 0 {
		n += length
	}
	return n
}

func LoadAvatarOBJ(path string) (*AvatarMesh, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	vs := make([]Vector, 1, 1024)
	vts := make([]Vector, 1, 1024)
	vns := make([]Vector, 1, 1024)

	currentMaterial := "Default"
	materialTriangles := make(map[string][]*Triangle)

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)

		if len(fields) == 0 {
			continue
		}

		keyword := fields[0]
		args := fields[1:]

		switch keyword {

		case "v":
			f := ParseFloats(args)
			vs = append(vs, Vector{f[0], f[1], f[2]})

		case "vt":
			f := ParseFloats(args)
			vts = append(vts, Vector{f[0], f[1], 0})

		case "vn":
			f := ParseFloats(args)
			vns = append(vns, Vector{f[0], f[1], f[2]})

		case "usemtl":
			if len(args) > 0 {
				currentMaterial = args[0]
			}

		case "f":
			fvs := make([]int, len(args))
			fvts := make([]int, len(args))
			fvns := make([]int, len(args))

			for i, arg := range args {
				vertex := strings.Split(arg+"//", "/")

				fvs[i] = parseIndex(vertex[0], len(vs))
				fvts[i] = parseIndex(vertex[1], len(vts))
				fvns[i] = parseIndex(vertex[2], len(vns))
			}

			for i := 1; i < len(fvs)-1; i++ {
				i1, i2, i3 := 0, i, i+1

				t := Triangle{}

				t.V1.Position = vs[fvs[i1]]
				t.V2.Position = vs[fvs[i2]]
				t.V3.Position = vs[fvs[i3]]

				if fvns[i1] > 0 {
					t.V1.Normal = vns[fvns[i1]]
				}
				if fvns[i2] > 0 {
					t.V2.Normal = vns[fvns[i2]]
				}
				if fvns[i3] > 0 {
					t.V3.Normal = vns[fvns[i3]]
				}

				if fvts[i1] > 0 {
					t.V1.Texture = vts[fvts[i1]]
				}
				if fvts[i2] > 0 {
					t.V2.Texture = vts[fvts[i2]]
				}
				if fvts[i3] > 0 {
					t.V3.Texture = vts[fvts[i3]]
				}

				t.FixNormals()

				materialTriangles[currentMaterial] =
					append(materialTriangles[currentMaterial], &t)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	result := &AvatarMesh{
		Parts: make(map[string]*Mesh),
	}

	for material, triangles := range materialTriangles {
		mesh := NewTriangleMesh(triangles)
		result.Parts[material] = mesh
	}

	return result, nil
}

// ---------------------------------------------------------------------
// From here down is what changed: camera/render constants stay the same,
// but the CLI flags + file output are replaced with an HTTP server that
// loads the avatar mesh once at startup and re-renders it per request.
// ---------------------------------------------------------------------

const (
	scale  = 2   // optional supersampling
	width  = 512 // output width in pixels
	height = 512 // output height in pixels
	fovy   = 45  // vertical field of view in degrees
	near   = 0.1 // near clipping plane
	far    = 500 // far clipping plane
)

var (
	eye          = V(4, 1, 10)
	center       = V(0, -0.35, 0)
	up           = V(0, 1, 0)
	light        = V(0.5, 1, 1).Normalize()
	defaultColor = HexColor("#E7E7E7FF")

	baseAvatar  *AvatarMesh      // loaded once at startup, reused for every request
	accessories map[string]*Mesh // catalog of accessory meshes (hats, glasses, backpacks, ...), keyed by filename

	textureIndex map[string]string // id -> filepath, built at startup (cheap: just a directory listing, no decoding)
	textureCache = struct {
		sync.RWMutex
		m map[string]Texture
	}{m: make(map[string]Texture)} // actual decoded textures, populated on first use only
)

// AvatarConfig is the JSON body the SvelteKit app sends.
// Shirt/Pants can be EITHER a solid hex color OR a texture ID from the catalog —
// if *Texture is set, it takes priority over the *Color for that part.
type AvatarConfig struct {
	// Category is purely for folder organization on disk/URL (e.g. "avatars",
	// "catalog-items") — it carries no identity or ownership meaning. Same
	// config always hashes to the same filename regardless of category.
	Category     string            `json:"category"`
	Skin         string            `json:"skin"`
	Shirt        string            `json:"shirt"`        // hex color fallback
	ShirtTexture string            `json:"shirtTexture"` // catalog ID, e.g. "stripes-01"
	Pants        string            `json:"pants"`
	PantsTexture string            `json:"pantsTexture"`
	PartColors   map[string]string `json:"partColors"`
	Accessories  []AccessoryConfig `json:"accessories"` // any number of accessories, e.g. hat + glasses + backpack
}

// AccessoryConfig references one item from the accessory catalog, with an
// optional color override (falls back to defaultColor if empty, matching
// how your original CLI drew extra -object meshes in the default gray).
type AccessoryConfig struct {
	ID    string `json:"id"`    // catalog filename without extension, e.g. "hat-01"
	Color string `json:"color"` // optional hex color, e.g. "#ff5c8a"
}

// buildTextureIndex just lists the directory and records id -> filepath —
// no image decoding happens here, so this is cheap even with a large catalog.
func buildTextureIndex(dir string) map[string]string {
	result := make(map[string]string)
	entries, err := os.ReadDir(dir)
	if err != nil {
		log.Printf("no texture catalog found at %s: %v", dir, err)
		return result
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		id := strings.TrimSuffix(name, filepath.Ext(name))
		result[id] = filepath.Join(dir, name)
	}
	return result
}

// getTexture returns the decoded Texture for the given catalog ID, loading
// and decoding it from disk only the first time it's requested. Subsequent
// requests for the same ID are served from the in-memory cache.
func getTexture(id string) (Texture, bool) {
	textureCache.RLock()
	tex, ok := textureCache.m[id]
	textureCache.RUnlock()
	if ok {
		return tex, true
	}

	path, ok := textureIndex[id]
	if !ok {
		return nil, false // unknown ID, not in the catalog at all
	}

	textureCache.Lock()
	defer textureCache.Unlock()

	// re-check after acquiring the write lock, in case another concurrent
	// request already loaded this texture while we were waiting
	if tex, ok := textureCache.m[id]; ok {
		return tex, true
	}

	tex, err := LoadTexture(path)
	if err != nil {
		log.Printf("warning: could not load texture %s: %v", path, err)
		return nil, false
	}
	textureCache.m[id] = tex
	return tex, true
}

// loadAccessoryCatalog loads every OBJ in the given directory once at startup,
// keyed by filename without extension — the generalized replacement for your
// original CLI's repeated `-object` flags + LoadOBJ calls.
func loadAccessoryCatalog(dir string) map[string]*Mesh {
	result := make(map[string]*Mesh)
	entries, err := os.ReadDir(dir)
	if err != nil {
		log.Printf("no accessory catalog found at %s: %v", dir, err)
		return result
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		if filepath.Ext(name) != ".obj" {
			continue
		}
		id := strings.TrimSuffix(name, filepath.Ext(name))
		mesh, err := LoadOBJ(filepath.Join(dir, name))
		if err != nil {
			log.Printf("warning: could not load accessory %s: %v", name, err)
			continue
		}
		result[id] = mesh
	}
	return result
}

func renderAvatar(cfg AvatarConfig, headshot bool) []byte {
	context := NewContext(width*scale, height*scale)
	context.ClearColorBuffer() // transparent background, same as your original

	aspect := float64(width) / float64(height)
	cameraEye, cameraCenter := eye, center
	if headshot {
		cameraEye = V(0, 1.4, 4)
		cameraCenter = V(0, 1.35, 0)
	}
	matrix := LookAt(cameraEye, cameraCenter, up).Perspective(fovy, aspect, near, far)

	skin := HexColor(cfg.Skin)
	shirt := HexColor(cfg.Shirt)
	pants := HexColor(cfg.Pants)

	colors := map[string]Color{
		"Head":     skin,
		"Torso":    shirt,
		"RightArm": skin,
		"LeftArm":  skin,
		"RightLeg": pants,
		"LeftLeg":  pants,
	}
	for material, value := range cfg.PartColors {
		colors[material] = HexColor(value)
	}

	// textures only apply to Torso/legs (clothing), not skin — keyed by the
	// same material names so the draw loop below can look them up uniformly.
	// getTexture() loads+decodes on first use only, so a request that doesn't
	// reference a given texture never pays for it.
	partTextures := map[string]Texture{}
	if cfg.ShirtTexture != "" {
		if tex, ok := getTexture(cfg.ShirtTexture); ok {
			partTextures["Torso"] = tex
		}
	}
	if cfg.PantsTexture != "" {
		if tex, ok := getTexture(cfg.PantsTexture); ok {
			partTextures["RightLeg"] = tex
			partTextures["LeftLeg"] = tex
		}
	}

	// one shader instance, reconfigured per part — a texture takes priority
	// over the solid color for that part when both are present
	shader := NewPhongShader(matrix, light, cameraEye)
	context.Shader = shader

	for material, part := range baseAvatar.Parts {
		if tex, ok := partTextures[material]; ok {
			shader.Texture = tex
			shader.ObjectColor = White // avoid tinting the texture; PhongShader multiplies texture sample by ObjectColor
		} else if c, ok := colors[material]; ok {
			shader.Texture = nil
			shader.ObjectColor = c
		} else {
			shader.Texture = nil
			shader.ObjectColor = defaultColor
		}
		context.DrawMesh(part)
	}

	// any number of accessories — generalized version of your original
	// objectsList loop, but now each one can be individually colored
	// instead of always drawing in the flat default gray
	for _, acc := range cfg.Accessories {
		mesh, ok := accessories[acc.ID]
		if !ok {
			log.Printf("warning: unknown accessory ID %q, skipping", acc.ID)
			continue
		}
		shader.Texture = nil
		if acc.Color != "" {
			shader.ObjectColor = HexColor(acc.Color)
		} else {
			shader.ObjectColor = defaultColor
		}
		context.DrawMesh(mesh)
	}

	// downsample for antialiasing, same as your original
	image := context.Image()
	image = resize.Resize(width, height, image, resize.Bilinear)

	var buf bytes.Buffer
	png.Encode(&buf, image)
	return buf.Bytes()
}

// configHash returns a short, stable hash of the config's visually-relevant
// fields — deliberately excludes Category, which is just folder organization,
// so identical-looking configs always dedupe to the same file regardless of
// whether they're rendered as a user avatar, a catalog item, or anything else.
func configHash(cfg AvatarConfig) string {
	hashable := struct {
		Skin         string
		Shirt        string
		ShirtTexture string
		Pants        string
		PantsTexture string
		PartColors   map[string]string
		Accessories  []AccessoryConfig
	}{cfg.Skin, cfg.Shirt, cfg.ShirtTexture, cfg.Pants, cfg.PantsTexture, cfg.PartColors, cfg.Accessories}

	data, _ := json.Marshal(hashable)
	sum := sha256.Sum256(data)
	return hex.EncodeToString(sum[:])[:12]
}

type RenderResult struct {
	Hash         string `json:"hash"`
	URL          string `json:"url"`
	HeadshotHash string `json:"headshotHash"`
	HeadshotURL  string `json:"headshotUrl"`
}

func saveRenderedPNG(cfg AvatarConfig, pngBytes []byte) (RenderResult, error) {
	assetsDir := os.Getenv("ASSETS_DIR")
	if assetsDir == "" {
		assetsDir = "/assets"
	}

	baseURL := os.Getenv("ASSET_BASE_URL")

	category := cfg.Category
	if category == "" {
		category = "renders" // generic fallback bucket if the caller doesn't specify one
	}

	targetDir := filepath.Join(assetsDir, category)
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		return RenderResult{}, err
	}

	filename := configHash(cfg) + ".png"
	fullPath := filepath.Join(targetDir, filename)

	// content-addressed: if this exact visual config was already rendered
	// (by anyone, for anything), the file already exists — skip the write
	if _, err := os.Stat(fullPath); err == nil {
		return RenderResult{Hash: configHash(cfg), URL: fmt.Sprintf("%s/%s/%s", baseURL, category, filename)}, nil
	}

	if err := os.WriteFile(fullPath, pngBytes, 0o644); err != nil {
		return RenderResult{}, err
	}

	return RenderResult{Hash: configHash(cfg), URL: fmt.Sprintf("%s/%s/%s", baseURL, category, filename)}, nil
}

func handleRender(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "POST only", http.StatusMethodNotAllowed)
		return
	}

	var cfg AvatarConfig
	if err := json.NewDecoder(r.Body).Decode(&cfg); err != nil {
		http.Error(w, "invalid config", http.StatusBadRequest)
		return
	}

	imgBytes := renderAvatar(cfg, false)

	result, err := saveRenderedPNG(cfg, imgBytes)
	if err != nil {
		log.Printf("failed to save rendered avatar: %v", err)
		http.Error(w, "failed to save render", http.StatusInternalServerError)
		return
	}
	headshotCfg := cfg
	headshotCfg.Category = "headshots"
	headshotResult, err := saveRenderedPNG(headshotCfg, renderAvatar(headshotCfg, true))
	if err != nil {
		log.Printf("failed to save avatar headshot: %v", err)
		http.Error(w, "failed to save render", http.StatusInternalServerError)
		return
	}
	result.HeadshotHash = headshotResult.Hash
	result.HeadshotURL = headshotResult.URL

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func main() {
	avatarPath := os.Getenv("AVATAR_OBJ_PATH")
	if avatarPath == "" {
		avatarPath = "/assets/avatar.obj"
	}

	mesh, err := LoadAvatarOBJ(avatarPath)
	if err != nil {
		log.Fatalf("failed to load avatar mesh: %v", err)
	}
	mesh.SmoothNormalsThreshold(Radians(30))
	baseAvatar = mesh

	accessoriesDir := os.Getenv("ACCESSORIES_DIR")
	if accessoriesDir == "" {
		accessoriesDir = "/assets/accessories"
	}
	accessories = loadAccessoryCatalog(accessoriesDir)
	log.Printf("loaded %d catalog accessories", len(accessories))

	texturesDir := os.Getenv("TEXTURES_DIR")
	if texturesDir == "" {
		texturesDir = "/assets/textures"
	}
	textureIndex = buildTextureIndex(texturesDir)
	log.Printf("indexed %d catalog textures (loaded lazily on first use)", len(textureIndex))

	http.HandleFunc("/render", handleRender)
	log.Println("avatar-renderer listening on :3001")
	log.Fatal(http.ListenAndServe(":3001", nil))
}
