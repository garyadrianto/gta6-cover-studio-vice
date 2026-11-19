import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), 'app');
const port = parseInt(process.env.PORT || '8080', 10);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let file = join(root, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  res.end(readFileSync(file));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[serve] Vice Studio ready on http://127.0.0.1:${port}`);
});
