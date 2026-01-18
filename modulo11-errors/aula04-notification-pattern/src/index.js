import { createServer } from 'http';
import { statusCodes } from './util/httpStatusCodes.js';
import HeroEntity from './heroEntity.js';


async function handle(request, response) {
  for await (const data of request) {
    try {
      const parsedData = JSON.parse(data.toString());

      if (Reflect.has(parsedData, "connectionError")) {
        throw new Error("Error connecting to the database");
      }

      const hero = new HeroEntity(parsedData);


      if (!hero.isValid()) {
        response.writeHead(statusCodes.BAD_REQUEST);
        response.write(JSON.stringify(hero.getNotifications().join('\n')));
        continue;
      }


      // Cadastra no banco de dados.

      response.writeHead(statusCodes.OK);
      response.write(JSON.stringify(hero));
    } catch (error) {

      response.writeHead(statusCodes.INTERNAL_SERVER_ERROR);
      response.write(JSON.stringify({ error: "Internal Server Error" }));
    } finally {
      response.end();
    }
  }
}


// Simple HTTP API
const server = createServer(handle).listen(3000, () =>
  console.log('Server running at http://localhost:3000/')
)

/**
 * curl -i localhost:3000 -X POST --data '{"name": "Vingador", "power": "Rich", "age": 2000}'
 */