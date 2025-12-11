# ==============================================================================
# Makefile - Expenser App
# ==============================================================================
# Robust makefile for development and production environments
# ==============================================================================

.PHONY: help dev dev-build dev-up dev-down dev-logs dev-restart dev-rebuild dev-shell prod prod-build prod-up prod-down prod-logs prod-restart prod-shell install lint lint-fix format format-check test build clean clean-all health check-docker check-docker-compose check-env-dev check-env-prod check-prerequisites-dev check-prerequisites-prod

# Variables
DOCKER_COMPOSE_DEV = docker compose -f docker-compose.development.yml
DOCKER_COMPOSE_PROD = docker compose -f docker-compose.production.yml
CONTAINER_DEV = expense-manager-app-development
CONTAINER_PROD = expense-manager-app-production

# Environment files
ENV_DEV := .env
ENV_PROD := .env.production
ENV_EXAMPLE := .env.example

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

## help: Display this help message
help:
	@echo "$(GREEN)Expenser App - Makefile Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Development Commands:$(NC)"
	@echo "  make dev              - Start development environment (build + up)"
	@echo "  make dev-build        - Build development image"
	@echo "  make dev-up           - Start development containers"
	@echo "  make dev-down         - Stop development containers"
	@echo "  make dev-logs         - View development logs"
	@echo "  make dev-restart      - Restart development containers"
	@echo "  make dev-rebuild      - Rebuild and restart development containers"
	@echo "  make dev-shell        - Open shell in development container"
	@echo ""
	@echo "$(YELLOW)Production Commands:$(NC)"
	@echo "  make prod             - Start production environment (build + up)"
	@echo "  make prod-build       - Build production Docker image"
	@echo "  make prod-up          - Start production containers"
	@echo "  make prod-down        - Stop production containers"
	@echo "  make prod-logs        - View production logs"
	@echo "  make prod-restart     - Restart production containers"
	@echo "  make prod-shell       - Open shell in production container"
	@echo ""
	@echo "$(YELLOW)Local Development Commands:$(NC)"
	@echo "  make install          - Install dependencies locally"
	@echo "  make build            - Build production bundle locally"
	@echo "  make test             - Run tests"
	@echo "  make lint             - Run linter"
	@echo "  make lint-fix         - Fix linting issues"
	@echo "  make format           - Format code with Prettier"
	@echo "  make format-check     - Check code formatting"
	@echo ""
	@echo "$(YELLOW)Utility Commands:$(NC)"
	@echo "  make clean            - Remove containers and volumes"
	@echo "  make clean-all        - Remove everything including images"
	@echo "  make health           - Check container health"
	@echo ""
	@echo "$(YELLOW)Prerequisite Check Commands:$(NC)"
	@echo "  make check-docker             - Check if Docker is installed and running"
	@echo "  make check-docker-compose     - Check if Docker Compose is available"
	@echo "  make check-env-dev            - Check development environment file"
	@echo "  make check-env-prod           - Check production environment file"
	@echo "  make check-prerequisites-dev  - Check all development prerequisites"
	@echo "  make check-prerequisites-prod - Check all production prerequisites"
	@echo ""

# ============================================================================
# Prerequisite Checks
# ============================================================================

## check-docker: Check if Docker is installed and running
check-docker:
	@which docker >/dev/null 2>&1 || { echo "$(RED)❌ Error: Docker is not installed!$(NC)"; echo "$(YELLOW)Install Docker from: https://docs.docker.com/get-docker/$(NC)"; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "$(RED)❌ Error: Docker daemon is not running!$(NC)"; echo "$(YELLOW)Please start Docker Desktop or Docker daemon$(NC)"; exit 1; }
	@echo "$(GREEN)✅ Docker is installed and running$(NC)"

## check-docker-compose: Check if Docker Compose is available
check-docker-compose:
	@docker compose version >/dev/null 2>&1 || { echo "$(RED)❌ Error: Docker Compose is not available!$(NC)"; echo "$(YELLOW)Docker Compose is required (comes with Docker Desktop)$(NC)"; exit 1; }
	@echo "$(GREEN)✅ Docker Compose is available$(NC)"

## check-env-dev: Check if development environment file exists
check-env-dev:
	@if [ ! -f $(ENV_DEV) ]; then \
		echo "$(RED)❌ Error: $(ENV_DEV) not found!$(NC)"; \
		echo "$(YELLOW)Creating $(ENV_DEV) from $(ENV_EXAMPLE)...$(NC)"; \
		cp $(ENV_EXAMPLE) $(ENV_DEV); \
		echo "$(GREEN)✅ Created $(ENV_DEV)$(NC)"; \
		echo "$(YELLOW)⚠️  Please update the values in $(ENV_DEV) before starting!$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ $(ENV_DEV) exists$(NC)"

## check-env-prod: Check if production environment file exists
check-env-prod:
	@if [ ! -f $(ENV_PROD) ]; then \
		echo "$(RED)❌ Error: $(ENV_PROD) not found!$(NC)"; \
		echo "$(YELLOW)⚠️  Production environment file is required!$(NC)"; \
		echo "$(YELLOW)Creating $(ENV_PROD) template...$(NC)"; \
		cp $(ENV_EXAMPLE) $(ENV_PROD); \
		echo "$(GREEN)✅ Created $(ENV_PROD) template$(NC)"; \
		echo "$(RED)⚠️  IMPORTANT: Update all values in $(ENV_PROD) with production settings!$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ $(ENV_PROD) exists$(NC)"

## check-prerequisites-dev: Check all prerequisites for development
check-prerequisites-dev: check-docker check-docker-compose check-env-dev
	@echo "$(GREEN)✅ All development prerequisites are met!$(NC)"

## check-prerequisites-prod: Check all prerequisites for production
check-prerequisites-prod: check-docker check-docker-compose check-env-prod
	@echo "$(GREEN)✅ All production prerequisites are met!$(NC)"

# ============================================================================
# Development Environment
# ============================================================================

## dev: Start development environment
dev: check-prerequisites-dev dev-build dev-up

## dev-build: Build development Docker image
dev-build:
	@echo "$(GREEN)Building development image...$(NC)"
	$(DOCKER_COMPOSE_DEV) build --no-cache

## dev-up: Start development containers
dev-up:
	@echo "$(GREEN)Starting development environment...$(NC)"
	$(DOCKER_COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Development server running at http://localhost:5173$(NC)"
	@echo "$(GREEN)✅ Using .env for environment variables$(NC)"

## dev-down: Stop development containers
dev-down:
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	$(DOCKER_COMPOSE_DEV) down

## dev-logs: View development logs
dev-logs:
	$(DOCKER_COMPOSE_DEV) logs -f

## dev-restart: Restart development containers
dev-restart:
	@echo "$(YELLOW)Restarting development environment...$(NC)"
	$(DOCKER_COMPOSE_DEV) restart

## dev-rebuild: Rebuild and restart development containers
dev-rebuild:
	@echo "$(YELLOW)Rebuilding development environment...$(NC)"
	$(DOCKER_COMPOSE_DEV) down
	$(DOCKER_COMPOSE_DEV) build --no-cache
	$(DOCKER_COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Development server rebuilt and running at http://localhost:5173$(NC)"

## dev-shell: Open shell in development container
dev-shell:
	@echo "$(GREEN)Opening shell in development container...$(NC)"
	docker exec -it $(CONTAINER_DEV) sh

# ============================================================================
# Production Environment
# ============================================================================

## prod: Start production environment
prod: check-prerequisites-prod prod-build prod-up

## prod-build: Build production Docker image
prod-build:
	@echo "$(GREEN)Building production image...$(NC)"
	$(DOCKER_COMPOSE_PROD) build --no-cache

## prod-up: Start production containers
prod-up:
	@echo "$(GREEN)Starting production environment...$(NC)"
	$(DOCKER_COMPOSE_PROD) up -d
	@echo "$(GREEN)✅ Production server running at http://localhost:80$(NC)"
	@echo "$(GREEN)✅ Using .env.production for environment variables$(NC)"
	@sleep 2
	@$(DOCKER_COMPOSE_PROD) ps

## prod-down: Stop production containers
prod-down:
	@echo "$(YELLOW)Stopping production environment...$(NC)"
	$(DOCKER_COMPOSE_PROD) down

## prod-logs: View production logs
prod-logs:
	$(DOCKER_COMPOSE_PROD) logs -f

## prod-restart: Restart production containers
prod-restart:
	@echo "$(YELLOW)Restarting production environment...$(NC)"
	$(DOCKER_COMPOSE_PROD) restart

## prod-shell: Open shell in production container
prod-shell:
	@echo "$(GREEN)Opening shell in production container...$(NC)"
	docker exec -it $(CONTAINER_PROD) sh

# ============================================================================
# Local Development
# ============================================================================

## install: Install dependencies locally
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	pnpm install

## build: Build production bundle locally
build:
	@echo "$(GREEN)Building production bundle...$(NC)"
	pnpm build

## test: Run tests
test:
	@echo "$(GREEN)Running tests...$(NC)"
	pnpm test

## lint: Run linter
lint:
	@echo "$(GREEN)Running linter...$(NC)"
	pnpm lint

## lint-fix: Fix linting issues
lint-fix:
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	pnpm lint --fix || true

## format: Format code with Prettier
format:
	@echo "$(GREEN)Formatting code...$(NC)"
	pnpm exec prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"

## format-check: Check code formatting
format-check:
	@echo "$(GREEN)Checking code formatting...$(NC)"
	pnpm exec prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}"

# ============================================================================
# Utility Commands
# ============================================================================

## clean: Remove containers and volumes
clean:
	@echo "$(RED)Cleaning up containers and volumes...$(NC)"
	$(DOCKER_COMPOSE_DEV) down -v || true
	$(DOCKER_COMPOSE_PROD) down -v || true
	@echo "$(GREEN)✅ Containers and volumes removed$(NC)"

## clean-all: Remove everything including images
clean-all: clean
	@echo "$(RED)Removing all images...$(NC)"
	docker rmi -f $$(docker images -q expense-manager-app*) 2>/dev/null || true
	rm -rf node_modules dist .vite 2>/dev/null || true
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

## health: Check container health
health:
	@echo "$(GREEN)Checking container health...$(NC)"
	@docker ps --filter "name=expense-manager-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Default target
.DEFAULT_GOAL := help
