# Development Setup Guide

This guide will help you set up the Expenser App for local development.

## Prerequisites

### Required Software

- **Node.js 18+** (recommended: 20 LTS)

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **pnpm** (preferred package manager)

  ```bash
  npm install -g pnpm
  # Verify: pnpm --version
  ```

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Optional Software

- **Docker & Docker Compose** (for containerized development)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **VS Code** (recommended editor)
  - [Visual Studio Code](https://code.visualstudio.com/)
  - Recommended extensions are listed in `.vscode/extensions.json`

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sakilahmmad71/expense-manager-app.git
cd expense-manager-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file
nano .env  # or use your preferred editor
```

Configure the following variables:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 5. Verify Setup

1. Open `http://localhost:5173` in your browser
2. You should see the login page
3. Try creating an account (requires backend API running)

## Backend Setup

The frontend requires the backend API to function properly.

### Option 1: Local Backend Setup

1. Clone the backend repository:

   ```bash
   git clone https://github.com/sakilahmmad71/expense-manager-apis.git
   cd expense-manager-apis
   ```

2. Follow the backend setup instructions in that repository

3. Ensure the backend is running on `http://localhost:3000`

### Option 2: Docker Compose (All Services)

If you have all repositories cloned, you can use Docker Compose to start all services:

```bash
# Start all services (frontend, backend, database)
docker-compose -f docker-compose.development.yml up -d
```

## Development Workflow

### Code Style and Formatting

The project uses ESLint and Prettier for code quality:

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### TypeScript

```bash
# Type checking
pnpm type-check

# Build (includes type checking)
pnpm build
```

### Git Hooks

The project uses Husky for Git hooks:

```bash
# Install Git hooks (run once after cloning)
pnpm prepare
```

This will automatically run linting and formatting on commit.

## Docker Development

For a consistent development environment:

```bash
# Start development environment
make dev-up

# View logs
make dev-logs

# Stop environment
make dev-down

# Rebuild containers
make dev-rebuild
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
pnpm dev --port 3001
```

#### Node Version Issues

```bash
# Check current version
node --version

# If you use nvm
nvm use 20
nvm install 20
```

#### Permission Issues (Linux/Mac)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### Cache Issues

```bash
# Clear all caches
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Getting Help

1. Check existing [GitHub Issues](https://github.com/sakilahmmad71/expense-manager-app/issues)
2. Create a new issue with detailed information
3. Ask questions in [GitHub Discussions](https://github.com/sakilahmmad71/expense-manager-app/discussions)

## IDE Configuration

### VS Code Settings

The project includes recommended VS Code settings in `.vscode/settings.json`:

- Auto-format on save
- ESLint auto-fix
- TypeScript import organization
- TailwindCSS IntelliSense

### Recommended Extensions

Install the recommended extensions for the best development experience:

- Prettier - Code formatter
- ESLint - JavaScript/TypeScript linting
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense
- GitLens (optional)

## Project Structure

Understanding the codebase:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx # Auth route guard
├── context/            # React Context providers
├── lib/               # Utilities and configurations
│   ├── api.ts         # API client setup
│   ├── services.ts    # API service functions
│   └── utils.ts       # Helper utilities
├── pages/             # Page components (routes)
└── App.tsx           # Main application component
```

## Next Steps

After setup:

1. Read the [Contributing Guidelines](../CONTRIBUTING.md)
2. Check out [Good First Issues](https://github.com/sakilahmmad71/expense-manager-app/labels/good%20first%20issue)
3. Join the [Community Discussions](https://github.com/sakilahmmad71/expense-manager-app/discussions)
