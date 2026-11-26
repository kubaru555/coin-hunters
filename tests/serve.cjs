// Opcjonalny podgląd HTTP, bez pakietów: node tests/serve.cjs
// Serwuje wyłącznie pliki gry, tylko na interfejsie lokalnym.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer((request, response) => {
  const route = new URL(request.url, 'http://localhost').pathname;
  const file = route === '/' ? '/index.html' : route;
  if (file !== '/index.html' && file !== '/css/style.css' && !/^\/js\/[a-z]+\.js$/.test(file)) {
    response.writeHead(404).end();
    return;
  }
  fs.readFile(path.join(root, file), (error, data) => {
    if (error) response.writeHead(404).end();
    else response.writeHead(200, { 'Content-Type': `${types[path.extname(file)]}; charset=utf-8`, 'Cache-Control': 'no-store' }).end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Podgląd gry: http://127.0.0.1:4173'));
