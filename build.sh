#!/bin/bash
# Master build and run script for the AFM project.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- AFM Project Setup ---"

# Step 1: Inform the user
echo "[1/3] Building Docker images for all services..."
echo "This might take a few minutes on the first run as it downloads base images."

# Step 2: Build all services defined in docker-compose.yml
# The --no-cache flag can be added to ensure fresh builds: docker-compose build --no-cache
docker-compose build

echo ""
echo "[2/3] Build process complete."
echo "Starting all services in the background..."

# Step 3: Start all services in detached mode (-d)
docker-compose up -d

echo ""
echo "[3/3] All services are now running!"
echo "----------------------------------------------------"
echo "✅ Your website is now available:"
echo ""
echo "   📖 Spec Site: http://localhost:8080"
echo "   🧪 Try-it App: http://localhost:8080/try-it"
echo ""
echo "----------------------------------------------------"
echo "To stop all services, run: docker-compose down"
echo ""