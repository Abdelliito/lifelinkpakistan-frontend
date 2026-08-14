# LifeLink Pakistan - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying LifeLink Pakistan to production environments.

## Prerequisites

- Docker & Docker Compose
- PostgreSQL 16+
- Node.js 20+
- Python 3.11+
- SSL/TLS certificates for HTTPS

## Pre-Deployment Checklist

- [ ] Generate new `SECRET_KEY` for backend
- [ ] Set up PostgreSQL database
- [ ] Configure CORS origins
- [ ] Obtain Gemini API key
- [ ] Set up SSL certificates
- [ ] Review and update all `.env.production.example` files
- [ ] Enable monitoring and logging
- [ ] Set up database backups
- [ ] Configure domain DNS
- [ ] Test staging deployment first

## Quick Start with Docker Compose

### 1. Clone and Prepare

```bash
git clone <repository-url>
cd lifelink-pakistan
```

### 2. Create Environment Files

```bash
# Backend production environment
cp lifelinkbackend/.env.production.example lifelinkbackend/.env.production

# Frontend production environment
cp .env.production.example .env.production.local

# Set secure values
export SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
export POSTGRES_PASSWORD=$(python -c "import secrets; print(secrets.token_hex(16))")
```

### 3. Update Configuration Files

Edit `docker-compose.yml` with production values:

```yaml
environment:
  DATABASE_URL: postgresql://lifelink_user:${POSTGRES_PASSWORD}@db:5432/lifelink_prod
  SECRET_KEY: ${SECRET_KEY}
  ENVIRONMENT: production
  GEMINI_API_KEY: ${GEMINI_API_KEY}
  CORS_ORIGINS: https://yourdomain.com,https://www.yourdomain.com
```

### 4. Build and Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check health
curl http://localhost:8000/health
curl http://localhost:3000/
```

### 5. Run Database Migrations

```bash
# Connect to backend container
docker-compose exec api bash

# Run Alembic migrations
alembic upgrade head

# Exit container
exit
```

## Kubernetes Deployment

For production Kubernetes deployments, create:

1. **ConfigMaps** for non-sensitive configuration
2. **Secrets** for sensitive data (API keys, database credentials)
3. **Deployments** for API and Frontend services
4. **Services** for internal communication
5. **Ingress** for external access with SSL

See `k8s/` directory for Kubernetes manifests.

## Manual Deployment (Traditional Server)

### Backend Setup

```bash
# 1. Install dependencies
cd lifelinkbackend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Configure environment
cp .env.production.example .env.production
# Edit .env.production with production values

# 3. Run database migrations
alembic upgrade head

# 4. Start service with Gunicorn
gunicorn app.main:app -c gunicorn_config.py
```

### Frontend Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.production.example .env.production.local
# Edit with production API URL

# 3. Build application
npm run build

# 4. Start server
npm start
```

## Nginx Reverse Proxy Configuration

```nginx
upstream api_backend {
    server localhost:8000;
}

upstream frontend_app {
    server localhost:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/ssl/certs/your_cert.crt;
    ssl_certificate_key /etc/ssl/private/your_key.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend
    location / {
        proxy_pass http://frontend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $http_x_request_id;

        # Timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

## Database Setup

### PostgreSQL Configuration

```bash
# Create database and user
psql -U postgres << EOF
CREATE DATABASE lifelink_prod;
CREATE USER lifelink_user WITH PASSWORD 'secure_password';
ALTER ROLE lifelink_user SET client_encoding TO 'utf8';
ALTER ROLE lifelink_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lifelink_user SET default_transaction_deferrable TO on;
ALTER ROLE lifelink_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE lifelink_prod TO lifelink_user;
EOF
```

### Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/lifelink"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U lifelink_user lifelink_prod > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

## Monitoring & Logging

### Health Checks

```bash
# Backend health check
curl -i http://localhost:8000/health

# Frontend health check
curl -i http://localhost:3000/
```

### View Logs

```bash
# Docker logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db

# Traditional deployment logs
tail -f /var/log/lifelink/api.log
tail -f /var/log/lifelink/frontend.log
```

## SSL/TLS Setup

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (cron job)
0 2 * * * /usr/bin/certbot renew --quiet
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure firewall allows port 5432

### API not responding
- Check container logs: `docker-compose logs api`
- Verify SECRET_KEY is set
- Check database migrations ran successfully

### Frontend not loading
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration
- Review browser console for errors

## Post-Deployment

1. **Monitor application metrics**
2. **Set up alerting** for errors and performance
3. **Test all features** in production
4. **Document any custom configurations**
5. **Schedule regular backups**
6. **Plan disaster recovery procedures**
7. **Monitor security logs** and access patterns

## Support

For issues or questions, open an issue in the repository or contact the development team.
