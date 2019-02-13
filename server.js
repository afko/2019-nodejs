const http = require('http');

const hostname = '127.0.0.1'; // localhost라 해도 돈다.
const port = 3000;

const server = http.createServer((req, res) => { // req, res는 request, response.
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
}); // 서버가 만들어지면 이 함수를 실행하시오.

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});