# Build
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
ENV DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
COPY . .
RUN npm run build

# Run
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "build"]