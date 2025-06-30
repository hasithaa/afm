# Use a Node.js image to serve the application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the application in preview mode (serves the built files)
CMD ["npm", "start"]
