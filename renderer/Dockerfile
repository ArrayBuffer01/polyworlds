FROM golang:1.25-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o avatar-renderer main.go

FROM scratch
COPY --from=build /app/avatar-renderer /avatar-renderer
COPY assets/ /assets/
ENV AVATAR_OBJ_PATH=/assets/avatar.obj
ENV ACCESSORIES_DIR=/assets/accessories
ENV TEXTURES_DIR=/assets/textures
EXPOSE 3001
ENTRYPOINT ["/avatar-renderer"]
