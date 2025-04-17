#!/bin/bash

# Exit on error
set -e

# Enable debug output
set -x

# Navigate to project directory
cd /opt/bitnami/apache/htdocs/markado

# Pull latest changes
git pull origin main

# Clean install
rm -rf node_modules .next
pnpm install --frozen-lockfile

# Generate Prisma client
pnpm prisma generate

# Show current directory structure
echo "Current directory structure:"
ls -la

# Show TypeScript configuration
echo "TypeScript configuration:"
cat tsconfig.json

# Build with explicit path resolution and Next.js configuration
NODE_ENV=production \
NEXT_TELEMETRY_DISABLED=1 \
TSC_COMPILE_ON_ERROR=true \
pnpm next build

# Restart PM2
pm2 restart all 