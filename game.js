const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('./logger');

const app = express();
const server = http.createServer(app);

// Set up static
app.use(express.static(path.join(__dirname, '/public/')));

// Set up routes
app.get('/', (req, res) => 
{
  logger.info('Sending index file...');
  res.sendFile(__dirname + '/index.html');
});

// Start the server
const port = 3000;
server.listen(port, () => 
{
  logger.info(`Server running on port ${port}`);
  console.log(`Server running on port ${port}`);
});
