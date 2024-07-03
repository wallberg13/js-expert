const http = require("http");
const { once } = require("events");

const DEFAULT_USER = {
  username: "WallBerg",
  password: "123",
};

const routes = {
  "/contact:get": (request, response) => {
    response.write("contact us page");
    return response.end();
  },
  // curl -X POST --data '{"username": "Wallberg", "password": "123"}' http://localhost:3000/login
  // curl -i -X POST --data '{"username": "Wallberg", "password": "1234"}' http://localhost:3000/login
  "/login:post": async (request, response) => {
    /**
     * Once: retorna promise que espera um evento ocorrer.
     * O JSON Parser pode lidar também com buffers.
     */
    const user = JSON.parse(await once(request, "data"));
    const toLower = (text) => text.toLowerCase();

    if (
      toLower(user.username) !== toLower(DEFAULT_USER.username) ||
      user.password !== DEFAULT_USER.password
    ) {
      response.writeHead(401);
      response.end("Login failed!");
      return;
    }

    return response.end("Login succeeded!");
  },
  default(request, response) {
    response.writeHead(404);
    return response.end("not found!");
  },
};

function handle(request, response) {
  const { url, method } = request;

  const routerKey = `${url.toLowerCase()}:${method.toLowerCase()}`;
  const chosen = routes[routerKey] || routes.default;

  return chosen(request, response);
}

const app = http
  .createServer(handle)
  .listen(3000, () => console.log("running at 3000"));

module.exports = app;
