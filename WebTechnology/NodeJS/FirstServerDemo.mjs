// FirstServerDemo.mjs
import { createServer } from 'node:http';

const port = 3000;
const ip = '127.0.0.1'; 

const server = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end("Hello World!\n");
});

// starts a simple http server locally on port 3000
server.listen(port, ip, () => {
  console.log('Listening on 127.0.0.1:3000');
})
// run with `node FirstServerDemo.mjs`
