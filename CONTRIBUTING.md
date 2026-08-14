# LifeLink Pakistan - Contributing Guide

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ (optional for local dev, SQLite works)
- Docker & Docker Compose (optional)

### Backend Setup

```bash
# Create virtual environment
cd lifelinkbackend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env.local
cp .env.example .env.local
# Edit with your settings

# Run development server
python run.py
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Run development server
npm run dev
# Visit http://localhost:3000
```

### With Docker Compose (Development)

```bash
# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Backend
cd lifelinkbackend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://lifelink_user:dev-password@localhost:5432/lifelink_dev
python run.py

# Frontend (in another terminal)
npm run dev
```

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Max line length: 100
- Use Black for formatting

```bash
black lifelinkbackend/
ruff check lifelinkbackend/
```

### TypeScript/JavaScript
- Follow ESLint configuration
- Use Prettier for formatting
- Max line length: 100

```bash
npm run lint
npm run lint:fix
```

## Testing

### Backend Tests
```bash
cd lifelinkbackend
pytest tests/
pytest --cov=app tests/  # With coverage
```

### Frontend Tests
```bash
npm run test
npm run test:coverage
```

## Database Migrations

### Create a Migration
```bash
cd lifelinkbackend
alembic revision --autogenerate -m "add_new_table"
```

### Review the Migration
```bash
# Edit alembic/versions/xyz_add_new_table.py
```

### Apply Migrations
```bash
alembic upgrade head
```

## Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance

**Example:**
```
feat(auth): add password reset functionality

This adds email-based password reset flow with
secure token validation.

Fixes #123
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit with conventional messages
4. Push to your fork: `git push origin feature/your-feature`
5. Open a pull request with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (for UI changes)
   - Test results

## Architecture Decisions

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Database**: PostgreSQL (production), SQLite (dev)

## API Documentation

API endpoints are documented at `/docs` (development only).

## Common Issues

### Database Connection Error
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Verify PostgreSQL is running
psql -U lifelink_user -d lifelink_prod
```

### Port Already in Use
```bash
# Find process using port
lsof -i :8000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Import Error
```bash
# Ensure Python path is correct
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Coding! 🚀**
