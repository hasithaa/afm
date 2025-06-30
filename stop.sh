#!/bin/bash
# Development environment shutdown script for the AFM project.

echo "--- Stopping AFM Development Environment ---"

# Stop and remove containers, networks, volumes, and images created by 'up'.
docker-compose down

echo "✅ All AFM services have been stopped."
echo ""
echo "To start the services again, run: ./start.sh"
echo ""
