const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.endsWith('.css')) {
    const fileName = req.url.split('/')[1]
    const css = fs.readFileSync(`./assets/${fileName}`, 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/css');
    return res.end(css)
  }
  if (req.method === 'GET' && req.url.endsWith('.js')) {
    const fileName = req.url.split('/')[1]
    const jsFile = fs.readFileSync(`./assets/${fileName}`, 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/javascript');
    return res.end(jsFile)
  }
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./assets/index.html', 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    return res.end(html)
  }
});

const port = process.env.PORT || 5500;
server.listen(port, () => console.log('Live on p:5500'));