const http = require('node:http');

const port = process.env.PORT || 8080;

http
  .createServer((req, res) => res.end('${{ values.name }} is up\n'))
  .listen(port, () => console.log(`listening on ${port}`));
