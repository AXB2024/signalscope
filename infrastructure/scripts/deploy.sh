#!/bin/bash
set -e

echo "🚀 Deploying SignalScope..."
docker-compose pull
docker-compose up -d --build
docker-compose ps
echo "✅ Deployment complete"
