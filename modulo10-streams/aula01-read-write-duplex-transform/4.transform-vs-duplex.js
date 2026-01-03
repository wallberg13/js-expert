import { Duplex, Transform } from "stream";

let count = 0;
const server = new Duplex({
  objectMode: true, // Faz não precisar trabalhar com buffer, mas gasta mais memoria.
  encoding: "utf-8",
  read() {
    const everySecond = (intervalContext) => {
      if (count++ <= 5) {
        this.push(`My Name Is Wall Berg [${count}]`);
        return;
      }

      clearInterval(intervalContext);
      this.push(null);
    };

    setInterval(function () {
      everySecond(this);
    });
  },
  // é como se fosse um objeto completamente diferente.
  write(chunk, encoding, cb) {
    console.log(`[Writable] saving`, chunk);
    cb();
  },
});

const transformToUpperCase = Transform({
  objectMode: true, // Para não precisar trabalhar com buffer, mas gasta mais memoria.
  transform(chunk, encoding, cb) {
    cb(null, chunk.toString().toUpperCase());
  },
});

// Provar que são canais de comunicação diferentes.
// write aciona o writable do Duplex.
server.write("[duplex] hey this is a writable!\n"); // Ele veio por fora do fluxo, ele precisa ser readable.

// O on data -> loga o que rolou no .push do readable.
// server.on("data", (msg) => console.log(`[Readable] data: ${msg}`));

// O server => Vai pegar toda saída do read e vai jogar para frente.
// server.pipe(process.stdout);

// O push deixa voce enviar mais dados. É como se fosse uma nova mensagem.
server.push("[duplex] hey this is also a readable!\n");

// O que aparece no readable só aparece quando o pipe é chamado.
// server.pipe(process.stdout);

// O transform é tbm um duplex, mas não possuem comunicação independente.
transformToUpperCase.write("[transform] hello from write!");

// O push vai ignorar o que vc tem na transform.
transformToUpperCase.push("[transform] hello from push! \n");

// Dificilmente utilizado.
server
  // Redireciona todos os dados de readable para os dados da duplex.
  .pipe(transformToUpperCase)
  .pipe(server);
