# AFM - Agent Flavored Markdown

AFM is a specification for describing AI agents in a portable and interoperable way. This repository contains the official specification, documentation, and tools related to the AFM project.

The goal is to create a universal standard that allows agents to be easily defined, shared, deployed, and understood across different platforms and implementations.

## Project Structure

The repository is organized into several key directories:


```

/
├── spec/                 \# The specification website source (MkDocs)
├── try-it-app/           \# Interactive editor SPA
├── proxy/                \# Nginx configuration for the reverse proxy
├── examples/             \# Sample .afm files
├── reference-implementations/ \# Reference implementations (e.g., Ballerina, python, Go, etc.)
├── misc/                 \# Miscellaneous support services (e.g., MCP servers)
├── docker-compose.yml    \# Defines how all services run together
└── start.sh              \# The development environment start script
└── stop.sh               \# The development environment stop script

````

## Quick Start: Running the Development Environment

Get the local development environment up and running in just a few steps.

### Prerequisites

* **Docker** and **Docker Compose**: Must be installed on your system.
* A **shell environment** (like Bash on Linux/macOS or WSL on Windows).

### Instructions

1.  **Clone the Repository:**
    ```sh
    git clone https://github.com/hasithaa/afm
    cd afm
    ```

2.  **Make the Script Executable:**
    (You only need to do this once)
    ```sh
    chmod +x start.sh
    ```

3.  **Run the Development Server:**
    ```sh
    ./start.sh
    ```

This script will build the necessary Docker images and start all the services. Once it's finished, you can access the site:

* **Specification Website:** [http://localhost:8080](http://localhost:8080)
* **Interactive App:** [http://localhost:8080/try-it/](http://localhost:8080/try-it/)

The development server features **live reloading**. Any changes you make to the files inside the `/spec/docs` directory will automatically update the website in your browser.

### Stopping the Environment

To stop all running services, use the following command:

```sh
./stop.sh
```