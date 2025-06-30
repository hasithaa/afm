#!/bin/bash
# Development environment startup script for the AFM project.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting AFM Development Environment ---"

echo "[1/2] Building images if they don't exist and starting services..."
# 'docker-compose up' will build images if they are not found.
# The -d flag runs them in the background.
docker-compose up -d --build

echo ""
echo "[2/2] Services are running with live reload enabled!"
echo "----------------------------------------------------"
echo "✅ Your website is now available:"
echo ""
echo "   📖 Spec Site: http://localhost:8080"
echo "   🧪 Try-it App: http://localhost:8080/try-it"
echo ""
echo "----------------------------------------------------"
echo "Any changes you make to files in the './spec' directory will automatically"
echo "reload the website in your browser."
echo ""
echo "To stop all services, run: docker-compose down"
echo ""
