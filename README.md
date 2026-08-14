# LifeLink Pakistan — AI-Assisted Blood Donor Network

**Connecting Blood Donors with Lives in Need**

> **Status: Production Ready** ✅
> 
> This project is a full-stack application with a Next.js frontend, FastAPI backend, and PostgreSQL database. Complete with production deployment guides, security hardening, monitoring, and comprehensive documentation.

---

## Overview

LifeLink Pakistan helps patients and families find compatible blood donors quickly during emergencies, and lets an AI assistant turn a plain-language description of an emergency into a structured, editable blood request.

## Features

- **Landing page** with quick donor search, platform stats, how-it-works, and AI feature preview
- **Secure authentication** — signup, login, logout with JWT tokens and password hashing
- **Donor search & filtering** — by blood group, city, and availability
- **Donor profile management** — register as donor, edit details, manage availability
- **Blood request flow** — create requests manually or via AI Assistant
- **AI Request Assistant** — describe emergencies in plain English to get pre-filled forms
- **Admin panel** — platform statistics, user/donor/request management
- **Production-ready** — Docker deployment, monitoring, security hardening, comprehensive docs
- Fully responsive, accessible, with proper error handling throughout

## Technology Stack

### Frontend
- **Next.js 15** (App Router) + **TypeScript**
- **React 19** + **React Hook Form** + **Zod** validation
- **Tailwind CSS v4** for styling
- Error boundaries, retry logic, security headers

### Backend
- **FastAPI** with Python 3.11+
- **SQLAlchemy** ORM with **PostgreSQL** (SQLite for dev)
- **JWT** authentication with bcrypt password hashing
- **Alembic** for database migrations
- Structured logging, request tracing, rate limiting

### DevOps
- **Docker** & **Docker Compose** for containerization
- **GitHub Actions** for CI/CD pipeline
- **Gunicorn** + **Uvicorn** for production serving
- Nginx reverse proxy configuration included

## Quick Start

### Prerequisites
- Docker & Docker Compose (recommended for production)
- Node.js 20+ (for frontend development)
- Python 3.11+ (for backend development)
- PostgreSQL 16+ (for production)

### Development Setup

**Frontend:**
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

**Backend:**
```bash
cd lifelinkbackend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
# API available at http://localhost:8000
```

**With Docker (Recommended):**
```bash
docker-compose -f docker-compose.dev.yml up -d  # PostgreSQL
npm run dev
cd lifelinkbackend && python run.py
```

### Production Deployment

```bash
# 1. Configure production environment
cp lifelinkbackend/.env.production.example lifelinkbackend/.env.production
cp .env.production.example .env.production.local

# 2. Update with production values
# - Generate SECRET_KEY
# - Set PostgreSQL credentials
# - Configure CORS origins

# 3. Deploy with Docker Compose
docker-compose up -d

# 4. Run database migrations
docker-compose exec api alembic upgrade head

# 5. Verify deployment
curl http://localhost:8000/health
curl http://localhost:3000/
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide.

## Project Structure

```
lifelink-pakistan/
├── lifelinkbackend/          # Python FastAPI backend
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   └── core/             # Config, security, database
│   ├── alembic/              # Database migrations
│   └── requirements.txt
│
├── src/                      # Next.js frontend
│   ├── app/                  # Routes
│   ├── components/           # React components
│   ├── lib/                  # Utilities & API client
│   ├── services/             # API integration
│   └── types/                # TypeScript types
│
├── Dockerfile.backend        # Backend container
├── Dockerfile.frontend       # Frontend container
├── docker-compose.yml        # Production setup
├── docker-compose.dev.yml    # Development setup
│
├── DEPLOYMENT.md             # Deployment guide
├── SECURITY.md               # Security best practices
├── MONITORING.md             # Monitoring & logging
├── CONTRIBUTING.md           # Development guidelines
└── PRODUCTION_CHECKLIST.md   # Pre-deployment checklist
```

## Authentication

### Frontend
- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Logout clears token and session

### Backend
- Signup/login endpoints return JWT token
- Token validation on protected endpoints
- Token expiration: 24 hours (configurable)

### Default Demo Accounts (Development Only)
| Role  | Email               | Password  |
|-------|---------------------|-----------|
| User  | `user@lifelink.pk`  | `user123` |
| Admin | `admin@lifelink.pk` | `admin123`|

## Database

### Development
- SQLite by default (no setup required)
- Located at `lifelink.db`

### Production
- PostgreSQL required
- Run migrations: `alembic upgrade head`
- Automated daily backups recommended
- Connection pooling configured

### Migrations
```bash
cd lifelinkbackend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## API Documentation

Visit `http://localhost:8000/docs` (development only, disabled in production)

## Configuration

### Environment Variables

**Frontend:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Backend:**
```bash
ENVIRONMENT=production|development
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secure-random-key
CORS_ORIGINS=https://yourdomain.com
GEMINI_API_KEY=your-gemini-key
```

See `.env.example` files for complete configuration.

## Security

Production security features:
- ✅ HTTPS/TLS encryption
- ✅ CSRF protection
- ✅ XSS prevention (Content Security Policy)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Rate limiting on API endpoints
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ Password hashing with bcrypt
- ✅ JWT token validation
- ✅ Request ID tracking for debugging
- ✅ Structured logging

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

## Monitoring & Logging

Features:
- Structured JSON logging in production
- Request ID tracking for distributed tracing
- Health check endpoints
- Prometheus metrics compatible
- Performance monitoring ready
- Error tracking integration (Sentry optional)

See [MONITORING.md](MONITORING.md) for setup guide.

## Testing

**Backend:**
```bash
cd lifelinkbackend
pytest tests/
pytest --cov=app tests/  # With coverage
```

**Frontend:**
```bash
npm run test
npm run test:coverage
```

**Linting:**
```bash
npm run lint              # Frontend
cd lifelinkbackend && ruff check .  # Backend
```

## Deployment

### Docker Compose (Recommended)
```bash
docker-compose build
docker-compose up -d
```

### Kubernetes
Kubernetes manifests available in `k8s/` (customize as needed)

### Traditional Server
See [DEPLOYMENT.md](DEPLOYMENT.md) for Nginx + systemd setup

### Cloud Platforms
- **Heroku**: See Procfile configuration
- **AWS**: ECS/Fargate with RDS PostgreSQL
- **Google Cloud**: Cloud Run + Cloud SQL
- **DigitalOcean**: App Platform + Managed PostgreSQL

## Performance

- Frontend: Next.js production build with code splitting
- Backend: Async FastAPI with connection pooling
- Database: Indexed queries and optimized schemas
- Caching: Frontend caching headers configured
- CDN: Static assets can be served via CDN

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Commit message format
- Pull request process
- Testing requirements

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Verify PostgreSQL
psql -U lifelink_user -d lifelink_prod
```

### Port Already in Use
```bash
# Find and kill process
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
kill -9 <PID>
```

### Container Issues
```bash
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose exec api bash  # Debug in container
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting.

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Complete deployment guide
- **[SECURITY.md](SECURITY.md)** — Security best practices
- **[MONITORING.md](MONITORING.md)** — Monitoring & alerting setup
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Development guidelines
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** — Pre-deployment checklist

## Performance & Reliability

- **Uptime Target**: 99.5%
- **Response Time**: < 200ms (p95)
- **Database Backups**: Automated daily
- **Health Checks**: Every 30 seconds
- **Rate Limiting**: 10 requests/minute per IP
- **Request Timeout**: 120 seconds (configurable)

## Support & Reporting

- **Bug Reports**: GitHub Issues
- **Security Issues**: security@lifelinkpakistan.com (do not open public issues)
- **General Support**: support@lifelinkpakistan.com
- **Documentation**: See docs/ directory

## License

[Add your license here]

## Changelog

### v1.0.0 (2024-01-15)
- ✨ Initial production-ready release
- 🔒 Full security hardening
- 📦 Docker deployment
- 📊 Monitoring & logging
- 🚀 CI/CD pipeline with GitHub Actions

---

**Made with ❤️ for Pakistan's Blood Donors**
