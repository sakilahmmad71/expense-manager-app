#!/bin/sh
# ==============================================================================
# Docker Entrypoint Script for Nginx Container
# ==============================================================================
# Purpose: Inject runtime environment variables into the built JavaScript bundle
# 
# How it works:
# 1. Vite build-time env vars are baked into JS at build time
# 2. This script can optionally replace placeholders at runtime if needed
# 3. For true runtime configuration, use window.__ENV__ pattern
# ==============================================================================

set -e

echo "=== Expenser App - Starting ==="
echo "Environment: ${NODE_ENV:-production}"

# Optional: Log environment variables (sanitize sensitive data)
if [ "${VITE_ENABLE_DEBUG}" = "true" ]; then
    echo "Debug mode enabled"
    echo "API URL: ${VITE_API_URL}"
fi

# Optional: Runtime environment variable injection
# If you need to inject runtime env vars into the built bundle, you can use sed
# Example: Replace placeholder in index.html or main JS files
# This is typically NOT needed for Vite apps as build-time env vars are sufficient

# Example runtime injection (commented out - use if needed):
# if [ -n "${VITE_API_URL}" ]; then
#     echo "Injecting VITE_API_URL at runtime: ${VITE_API_URL}"
#     find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" {} \;
# fi

# Create nginx PID directory
mkdir -p /var/run

echo "=== Starting Nginx ==="
exec "$@"
