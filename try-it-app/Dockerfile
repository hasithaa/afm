# Use a lightweight Nginx image to serve static content
FROM nginx:1.25-alpine

# Remove the default Nginx welcome page
RUN rm /usr/share/nginx/html/index.html

# Copy our custom 'coming soon' page to the web root
COPY index.html /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
