#!/bin/bash

# Exit on error
set -e

# Navigate to project directory
cd /opt/bitnami/apache/htdocs/markado

# Pull latest changes
git pull origin main

# Clean install
rm -rf node_modules .next
pnpm install --frozen-lockfile

# Build
NODE_ENV=production pnpm build

# Restart PM2
pm2 restart all 