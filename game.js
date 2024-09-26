const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

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

app.get('/js/main.js', (req, res) => 
{
  logger.info('Sending merged JavaScript file...');

  const folders = 
  [
    path.join(__dirname, "/js/utils"),
    path.join(__dirname, "/js/map"),
    path.join(__dirname, "/js/editor")
  ];

  let merge = "";

  folders.forEach(folder => 
  {
    logger.info('Merging folder...' + folder);
    const files = fs.readdirSync(folder);

    files.forEach(file => 
    {
      const fullPath = path.join(folder, file);

      logger.info('Merging file...' + fullPath);

      if(fs.statSync(fullPath).isFile() && path.extname(fullPath) === ".js")
      {
        const content = fs.readFileSync(fullPath, "utf-8");

        merge += content + "\n";
      }        
    }); // loop for files in each folder
  }); // loop for source folders

  logger.info(`Size of JavaScript...${merge.length}`);

  res.setHeader('Content-Type', 'application/javascript');
  res.send(merge);
});

// Start the server
const port = 3000;
server.listen(port, () => 
{
  logger.info(`Server running on port ${port}, root = ${__dirname}`);
  console.log(`Server running on port ${port}`);
});
