/**
 * O transform é que junta todo mundo.
 */

import { Readable, Writable, Transform } from "stream";
import { createWriteStream } from "fs";

// 01 - Fonte de Dados
const readable = Readable({
  read() {
    /**
     * Aqui estou gerando a demanda dos dados. A medida que tem o "push" de dados,
     * o stream vai consumindo os dados e enviando para frente.
     *
     * O for é bloqueante...
     */
    for (let index = 0; index < 1e6; index++) {
      const person = { id: Date.now() + index, name: `Wall Berg - ${index}` };
      const data = JSON.stringify(person);
      this.push(data);
    }

    // null => indica que o stream terminou. Informa que os dados acabaram.
    this.push(null);
  },
});

/**
 * 02 - Processamento dos dados.
 */
const mapFields = Transform({
  transform(chunk, encoding, cb) {
    const data = JSON.parse(chunk.toString());
    const result = `${data.id},${data.name.toUpperCase()}\n`;

    // null => erro, se não houver erro.
    // result => é o resultado do transform.
    cb(null, result);
  },
});

/**
 * 02.01 - Supondo que queremos processar o headers do arquivo.
 *
 * A primeira vez que o transform é chamado, vamos passar o headers,
 * e a partir da segunda vez, vamos passar o chunk para frente, sem modificação.
 *
 * Eu consigo criar contexto, dentro do proprio transform, fazendo com que
 * seja possível acessar essa váriavel em qualquer momento que eu quiser.
 */
const mapHeaders = Transform({
  transform(chunk, encoding, cb) {
    this.counter = this.counter ?? 0;

    if (this.counter) {
      return cb(null, chunk); // Passa o chunk para frente, sem modificação.
    }

    this.counter += 1;
    cb(null, "id,name\n".concat(chunk));
  },
});

// 03 - Saida de Dados
//    - O único lugar "permitido" para Callback é nos streams.
// const writable = Writable({
//   write(chunk, encoding, cb) {
//     // chunk => é um pedacinho de buffer.
//     console.log("msg", chunk.toString());
//     cb(); // A função terminou de executar.
//   },
// });

/**
 * Aqui não estamos manipulando nenhum evento, só estamos passando a
 * informação para frente.
 *
 * Pipe Nativo do NodeJS.
 */
const pipeline = readable
  // mapFields => é o processamento dos dados.
  .pipe(mapFields)
  .pipe(mapHeaders)
  // writable => é sempre a saída dos dados -> imprimir, salvar, ignorar.
  // .pipe(writable);
  .pipe(createWriteStream("my.csv"));
// .pipe(process.stdout); // Aqui tbm é um stream que imprime na tela.

pipeline.on("end", () => {
  console.log("Pipeline ended");
});
