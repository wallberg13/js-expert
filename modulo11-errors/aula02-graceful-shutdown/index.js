import { MongoClient } from 'mongodb';
import { createServer } from 'http';
import { promisify } from 'util';

async function dbConnect() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();

  console.log("Connected to MongoDB");
  const db = client.db("comics");
  return {
    client,
    collections: {
      heroes: db.collection("heroes"),
    }
  }
}

const { collections, client } = await dbConnect();

async function handle(request, response) {

  for await (const data of request) {

    try {
      const hero = JSON.parse(data.toString());

      await collections.heroes.insertOne({
        ...hero,
        updatedAt: new Date(),
      });
      const heroes = await collections.heroes.find().toArray();

      response.writeHead(200);
      response.write(JSON.stringify(heroes))
    } catch (error) {
      console.log('a request error has happened!', error);
      response.writeHead(500);
      response.write(JSON.stringify({ error: "Internal Server Error" }));
    } finally {
      response.end()
    }
  }
}

/**
 * curl -i localhost:3000 -X POST --data '{"name": "Batman", "power": "Rich", "age": 30}'
 */

const server = createServer(handle).listen(3000, () => {
  console.log("Server is running on port 3000 ", process.pid)
});

/**
 * "Deixa eu primeiro finalizar a aplicação!"
 * 
 * Garanto que nenhum cliente será desconectado, sem antes finalizar a aplicação.
 * @param {string} signal 
 */
const onStop = async (signal) => {
  console.log(`\nserver is shutting down... ${signal}`);

  console.log("Fechando o servidor HTTP...");
  await promisify(server.close.bind(server))(); // Bind para garantir o contexto da função
  console.log("Servidor HTTP fechado");

  console.log("Fechando a conexão com o MongoDB...");
  await client.close();
  console.log("Conexão com o MongoDB fechada");

  console.log("Finalizando a aplicação...");
  process.exit(0); // Tudo certo
  // process.exit(1); // Erro
}


["SIGINT", "SIGTERM"].forEach(event => process.on(event, onStop));

// await client.close();