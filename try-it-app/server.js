const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Set appropriate CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Serve static files with proper caching disabled for development
app.use(express.static(__dirname, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    // Disable caching for all static files
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Special handling for the try-it base path
app.get('/try-it', (req, res) => {
  console.log('Received request for /try-it base path');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch all other routes
app.get('*', (req, res) => {
  console.log(`Serving index.html for path: ${req.path}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server starting...`);
  console.log(`Server running and accessible from outside at http://0.0.0.0:${port}`);
  console.log(`Try-it app available at http://localhost:${port}/try-it`);
});
