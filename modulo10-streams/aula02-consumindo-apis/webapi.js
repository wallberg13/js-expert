import http from "http";
import { Readable } from "stream";

/**
 * Basicamente, o http funciona como streams,
 * logo, eu posso processar "dados sob demanda".
 */

function api1(request, response) {
  // // o que vem da readable do request, "ignoro", e mando o response.
  // // response => writable stream.
  // // request => readable stream.
  // // Todo dado do request, manda pro response.
  // response.write("Teste01\n");
  // response.write("Teste02\n");
  // response.write("Teste03\n");
  // response.write("Teste04\n");
  // request.pipe(response);
  let count = 0;
  const MAX_COUNT = 99;
  const readable = Readable({
    read() {
      const everySecond = (intervalContext) => {
        if (count++ <= MAX_COUNT) {
          this.push(
            JSON.stringify({
              id: Date.now() + count,
              name: `Wall Berg-${count}`,
            }) + "\n"
          );
          return;
        }
        clearInterval(intervalContext);
        this.push(null);
      };
      setInterval(function () {
        everySecond(this);
      });
    },
  });
  readable.pipe(response);
}

function api2(request, response) {
  let count = 0;
  const MAX_COUNT = 99;
  const readable = Readable({
    read() {
      const everySecond = (intervalContext) => {
        if (count++ <= MAX_COUNT) {
          this.push(
            JSON.stringify({
              id: Date.now() + count,
              name: `Zezinho-${count}`,
            }) + "\n"
          );
          return;
        }
        clearInterval(intervalContext);
        this.push(null);
      };
      setInterval(function () {
        everySecond(this);
      });
    },
  });
  readable.pipe(response);
}

http
  .createServer(api1)
  .listen(3000, () => console.log("Server is running on port 3000"));

http
  .createServer(api2)
  .listen(4000, () => console.log("Server is running on port 4000"));
