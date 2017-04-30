const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('api-data.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('JSON Server is running');
});
