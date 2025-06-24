# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the spec content into the container
COPY . .

# Expose the port MkDocs will run on
EXPOSE 8000

# The command to run when the container launches
# 'mkdocs serve' starts the live-reloading development server
# '--dev-addr 0.0.0.0:8000' makes it accessible from outside the container
CMD ["mkdocs", "serve", "--dev-addr", "0.0.0.0:8000"]
