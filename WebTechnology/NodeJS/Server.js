// Import the built-in http module
const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
  // Set status code and content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response
  res.end('Hello, this is a Node.js HTTP server!\n');
});

// Start listening on port 3000
server.listen(3000, 'localhost', () => {
  console.log('Server running at http://localhost:3000');
});