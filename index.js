const fs = require('fs');
const http = require('http');
const crypto = require('crypto');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const saveFilename = (url) =>
  `uploaded-file-${slugify(url)}-${crypto.randomBytes(16).toString('hex')}`;

const successObject = {
  success: true,
};

const httpServer = http.createServer((req, res) => {
  const saveName = saveFilename(req.url);

  // create writable stream
  const file = fs.createWriteStream(`./uploaded-files/${saveName}`);

  // pipe req data to file stream
  req.pipe(file);

  // send success response on end
  req.on('end', () => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(successObject));
    res.end();
  });

  // error handler
  req.on('error', (err) => {
    console.log(err);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => console.log(`Server running at ${PORT}`));
