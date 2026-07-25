FROM golang:1.26-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o avatar-renderer ./src

FROM scratch
COPY --from=build /app/avatar-renderer /avatar-renderer
COPY assets/ /app-assets/
ENV AVATAR_OBJ_PATH=/app-assets/avatar.obj
ENV ACCESSORIES_DIR=/app-assets/accessories
ENV TEXTURES_DIR=/app-assets/textures
EXPOSE 3001
ENTRYPOINT ["/avatar-renderer"]
