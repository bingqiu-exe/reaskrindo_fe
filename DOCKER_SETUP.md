# Docker Setup - siadmin39_fe

Docker container untuk aplikasi frontend siadmin39, memudahkan deployment di berbagai device.

## Prerequisites

- Docker Desktop (Windows/Mac) atau Docker Engine (Linux)
- Docker Compose v2+

## Struktur File

- `Dockerfile` - Multi-stage build (Node.js build → nginx serve)
- `docker-compose.yml` - Orchestration frontend + backend + database
- `nginx.conf` - Konfigurasi nginx untuk SPA routing dan API proxy
- `.dockerignore` - Exclude file dari build context

## Quick Start

### 1. Build dan Run dengan Docker Compose

```bash
# Build dan start semua services
docker-compose up -d --build

# Lihat logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

Frontend akan tersedia di: `http://localhost:8080`

### 2. Build Dockerfile Saja (Tanpa Backend)

```bash
# Build image
docker build -t siadmin39-frontend .

# Run container
docker run -d -p 8080:80 --name siadmin39-fe siadmin39-frontend
```

## Konfigurasi Backend

Edit `docker-compose.yml` bagian `backend` service:

```yaml
backend:
  build:
    context: ../siadmin39_backend  # Path ke backend repo
    dockerfile: Dockerfile
  # ... sesuaikan port, env, dll
```

Atau gunakan image backend yang sudah jadi:

```yaml
backend:
  image: your-registry/siadmin39-backend:latest
```

## Environment Variables (Opsional)

Buat file `.env` di root project:

```env
FRONTEND_PORT=8080
BACKEND_PORT=8000
NODE_ENV=production
```

Lalu update `docker-compose.yml`:

```yaml
ports:
  - "${FRONTEND_PORT}:80"
```

## Troubleshooting

### API calls gagal (404/502)

- Pastikan backend service running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Periksa `nginx.conf` proxy_pass sesuai dengan nama service backend

### Build lambat

- Pastikan `.dockerignore` exclude `node_modules` dan `dist`
- Gunakan Docker build cache: jangan ubah `package.json` saat testing

### Port conflict

Ubah port mapping di `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # Gunakan port 3000 instead of 8080
```

## Deployment ke Server Lain

### Via Docker Hub

```bash
# Tag image
docker tag siadmin39-frontend your-dockerhub-username/siadmin39-frontend:latest

# Push ke registry
docker push your-dockerhub-username/siadmin39-frontend:latest

# Di server target, pull dan run
docker pull your-dockerhub-username/siadmin39-frontend:latest
docker run -d -p 80:80 your-dockerhub-username/siadmin39-frontend:latest
```

### Via docker-compose.yml (Copy file)

1. Copy `docker-compose.yml` ke server target
2. Run: `docker-compose up -d`

## Production Tips

- Gunakan volume untuk persistent data (database)
- Set `restart: always` untuk auto-restart on crash
- Gunakan secrets/vault untuk sensitive env vars
- Setup reverse proxy (Traefik/Nginx) untuk HTTPS
- Enable logging dan monitoring (Prometheus/Grafana)

## Commands Reference

```bash
# Rebuild hanya frontend
docker-compose up -d --build frontend

# Stop dan remove containers + networks
docker-compose down

# Remove images juga
docker-compose down --rmi all

# View resource usage
docker stats

# Shell access ke container
docker exec -it siadmin39_frontend sh
```
