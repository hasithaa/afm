# Developer Guide

This document provides a technical overview of the AFM project architecture and development workflow.

## Architecture Overview

The project uses a microservices-oriented architecture orchestrated by `docker-compose`. This approach allows for clean separation of concerns and makes it easy to add or modify components without affecting the rest of the system.

### Services

1.  **`proxy`**
    * **Technology:** Nginx
    * **Role:** The single entry point for all user traffic. It listens on `http://localhost:8080` and routes requests to the appropriate backend service based on the URL path.
    * **Configuration:** `proxy/nginx.conf`

2.  **`spec`**
    * **Technology:** Python, MkDocs, Material for MkDocs
    * **Role:** Serves the main specification website. It runs the `mkdocs serve` command, which includes a built-in development server.
    * **Live Reloading:** Live reload is enabled via a volume mount in `docker-compose.yml`. The local `./spec` directory is mapped to the `/app` directory inside the container. When a file is changed locally, MkDocs detects it inside the container and triggers a browser refresh.

3.  **`try-it-app`**
    * **Technology:** Nginx (serving a static HTML placeholder)
    * **Role:** This service is a placeholder for the future interactive SPA where users can write, deploy, and test `.afm` files. It is currently served from `http://localhost:8080/try-it/`.

## Development Workflow

The primary script for development is `./build.sh`. This script is a wrapper around the `docker-compose up -d --build` command.

* `up`: Creates and starts containers.
* `-d`: Runs containers in detached mode (in the background).
* `--build`: Forces Docker to build the images before starting the containers. This is useful to ensure any changes to a `Dockerfile` are applied.

### Making Changes to the Specification

1.  Ensure the development environment is running (`./build.sh`).
2.  Open any file in the `./spec/docs/` directory.
3.  Make your changes and save the file.
4.  The website at `http://localhost:8080` will automatically refresh to show your changes.


## Troubleshooting

* **Changes Not Appearing:** If your changes aren't showing up, first ensure the development server is running. If it is, try forcing a full rebuild of the containers by running `docker-compose down` followed by `./build.sh`. This clears any potentially stale Docker cache layers.
* **Port Conflicts:** The proxy uses port `8080`. If another application on your machine is using this port, the services will fail to start. You can change the port mapping in `docker-compose.yml` (e.g., change `"8080:80"` to `"9080:80"` and access the site at `http://localhost:9080`).
* 