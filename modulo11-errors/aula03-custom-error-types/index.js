import { createServer } from 'http';
import BusinessError from './errors/businessError.js';
import { statusCodes } from './util/httpStatusCodes.js';

function validateHero(hero) {
  if (hero.age < 20) {
    throw new BusinessError("Hero is too young to fight!");
  }

  if (hero.name?.length < 3) {
    throw new BusinessError("name length must be higher than 3 characters");
  }

  // Simulando um outro erro, por exemplo, de banco de dados
  if (Reflect.has(hero, "connectionError")) {
    // Apenas um erro generico para trazer outro cenário de erro inesperado.
    throw new Error("Error connecting to the database");
  }
}

async function handle(request, response) {
  for await (const data of request) {
    try {
      const hero = JSON.parse(data.toString());

      validateHero(hero);

      response.writeHead(statusCodes.OK);
      response.write(JSON.stringify(hero));
    } catch (error) {
      if (error instanceof BusinessError) {
        response.writeHead(statusCodes.BAD_REQUEST);
        response.write(JSON.stringify({ error: error.message }));
        continue;
      }

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