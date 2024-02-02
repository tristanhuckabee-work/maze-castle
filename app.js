const http = require('http');

const server = http.createServer((req, res) => {
  res.end('hello?')
});

const port = 5500;
server.listen(port, () => {});