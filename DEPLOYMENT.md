# Expenser App - Production Deployment Guide

## File Organization

```
expense-manager-app/
├── nginx/
│   ├── nginx.conf              # Main nginx config
│   ├── default.conf            # Local/dev server config
│   ├── production.conf         # Production server config
│   └── docker-entrypoint.sh    # Container startup script
├── src/                        # Application source code
├── .env.example                # Example environment variables
├── .env.production.example     # Production environment template
├── Dockerfile.production       # Multi-stage production Dockerfile
├── Dockerfile.development      # Development Dockerfile
├── docker-compose.production.yml   # Production compose
├── docker-compose.development.yml      # Development compose
├── Makefile                    # Common commands
├── DEPLOYMENT.md               # Detailed deployment guide
└── README.md                   # Project documentation
```

## Environment Files

### .env (Development)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### .env.production (Production)

```env
NODE_ENV=production
VITE_APP_NAME=Expenser
VITE_APP_ENV=production
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=false
```

## Docker Images

### Development Image

- Hot reload enabled
- Vite dev server
- Port 5173
- Volume mounted for live code changes

### Production Image

- Multi-stage build (builder + nginx)
- Optimized size (~50MB)
- Security hardened
- Health checks enabled
- Resource limits enforced

## Nginx Configurations

### nginx/default.conf

- Local development and testing
- Simple configuration
- Health check endpoint at /health

### nginx/production.conf

- Production-ready
- Security headers
- Aggressive caching
- Optimized for reverse proxy
- Access/error logging

## Deployment Workflow

1. **Development**

   ```bash
   make dev                # Vite dev server
   make dev-docker         # Docker dev environment
   ```

2. **Local Testing**

   ```bash
   make build              # Build bundle
   make start              # Start local container
   ```

3. **Production**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with production values
   make deploy-prod        # Build and deploy
   ```

## Security Features

- ✅ Multi-stage build (no dev dependencies in production)
- ✅ Non-root user in container
- ✅ Limited Linux capabilities
- ✅ Read-only root filesystem (optional)
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ No direct port exposure (reverse proxy required)
- ✅ Resource limits (256MB RAM, 0.3 CPU)
- ✅ Health checks for container monitoring

## Quick Commands

```bash
# Build production image
make build-prod

# Deploy to production
make deploy-prod

# View logs
make logs-prod

# Check health
make health

# View stats
make stats

# Restart
make restart-prod

# Stop
make stop-prod
```

## Network Architecture

```
Internet
    ↓
Cloudflare/Load Balancer (SSL termination)
    ↓
Reverse Proxy (nginx on host)
    ↓
Docker Network: expense-network-production
    ↓
Container: expense-manager-app-production (port 80)
```

## Best Practices

1. **Never commit** `.env.production` to git
2. **Always use** reverse proxy (never expose container directly)
3. **Enable HTTPS** via Cloudflare or Let's Encrypt
4. **Monitor logs** regularly (`make logs-nginx`)
5. **Backup configs** before updates (`make backup`)
6. **Test locally** before production deployment
7. **Use versioned tags** for images (e.g., `:v1.0.0`)
8. **Keep images updated** (base images and dependencies)

## Environment Variables in Vite

Vite only exposes variables prefixed with `VITE_` to the browser:

```typescript
// Available in browser
import.meta.env.VITE_API_URL;
import.meta.env.VITE_APP_NAME;

// NOT available (missing VITE_ prefix)
import.meta.env.NODE_ENV; // Use import.meta.env.MODE instead
```

Build-time variables are baked into the JavaScript bundle during `pnpm build`.
