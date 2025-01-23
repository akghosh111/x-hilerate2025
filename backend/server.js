//server.js
// Import the express module
const express = require('express');

// Create an instance of the express application
const app = express();

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, this is the root/main route!');
});

// Define another route for "/api" with JSON response
app.get('/api', (req, res) => {
  res.json({ message: 'This is the API route.' });
});

// Define a route with URL parameters
app.get('/greet/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello, ${name}!`);
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});