const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const server = http.createServer((req, res) => {
  // Normalize and clean up path
  let reqUrl = req.url || '/';
  if (reqUrl.includes('?')) {
    reqUrl = reqUrl.split('?')[0];
  }

  // Treat root as index.html
  if (reqUrl === '/') {
    reqUrl = '/index.html';
  }

  // Map /public/ to /assets/ folder as fallback, but prefer files physically located in the public folder.
  let filePath = path.join(process.cwd(), reqUrl);
  if (reqUrl.startsWith('/public/')) {
    if (!fs.existsSync(filePath)) {
      const relativePart = reqUrl.substring('/public/'.length);
      const fallbackPath = path.join(process.cwd(), 'assets', relativePart);
      if (fs.existsSync(fallbackPath)) {
        filePath = fallbackPath;
      }
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
