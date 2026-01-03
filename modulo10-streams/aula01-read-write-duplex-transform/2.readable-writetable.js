import { Readable, Writable } from "stream";

// 01 - Fonte de Dados
const readable = Readable({
  read() {
    // Manda a informação para o stream, e para frente.
    this.push("Hello World 1");
    this.push("Hello World 2");
    this.push("Hello World 3");

    // null => indica que o stream terminou. Informa que os dados acabaram.
    this.push(null);
  },
});

// 02 - Saida de Dados
//    - O único lugar "permitido" para Callback é nos streams.
const writable = Writable({
  write(chunk, encoding, cb) {
    // chunk => é um pedacinho de buffer.
    console.log("msg", chunk.toString());
    cb(); // A função terminou de executar.
  },
});

/**
 * Aqui não estamos manipulando nenhum evento, só estamos passando a
 * informação para frente.
 */
readable
  // writable => é sempre a saída dos dados -> imprimir, salvar, ignorar.
  .pipe(writable);
// .pipe(process.stdout); // Aqui tbm é um stream que imprime na tela.
