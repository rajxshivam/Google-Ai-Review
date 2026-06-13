#!/bin/bash
set -e

echo "=== Deploying AI Reviews ==="
cd /opt/ai-reviews

# Pull latest images
docker compose pull

# Restart with new images
docker compose up -d --remove-orphans

# Clean up old images
docker image prune -f

echo "=== Deploy complete ==="
docker compose ps
