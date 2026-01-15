import Http from "http";

let count = 1;

async function handleRequest(request, response) {
  count++;
  try {
    /**
     * Como request é um stream, então podemos interar sobre ele.
     */
    if (count % 2 === 0) {
      await Promise.reject("error dentro do handle!");
    }

    /**
     * Nas versões mais antigas de NodeJS (não ocorre nessa versão mais nova),
     * a for await não irá capturar o erro, é como se ele rodasse em
     * outro contexto.
     *
     * Mas nessa versão mais nova, o for await irá capturar o erro.
     *
     * Moral: não é pq está tudo dentro de um try catch que vai ser
     * tudo pego.
     */
    for await (const data of request) {
      try {
        if (count % 2 !== 0) {
          await Promise.reject("error dentro do for!");
        }
      } catch (error) {
        console.log("a request error has happened!", error);

        response.writeHead(500);
        response.write(JSON.stringify({ error: "Internal Server Error" }));
      } finally {
        response.end();
      }
    }
  } catch (error) {
    console.log("a server error has happened!", error);

    response.writeHead(500);
    response.write(JSON.stringify({ error: "Internal Server Error" }));
    response.end();
  }
}

Http.createServer(handleRequest).listen(3000, () => {
  console.log("Server is running on port 3000");
});
