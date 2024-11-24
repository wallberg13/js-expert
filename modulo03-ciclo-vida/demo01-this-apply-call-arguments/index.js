"use strict";

/**
 * Método básico de como ouvir o proprio arquivo.
 * Provalmente, assim foi feito o nodemon
 */
const {
  watch,
  promises: { readFile },
} = require("fs");

// watch(__filename, async (event, filename) => {
//   console.log((await readFile(filename)).toString());
// });

class File {
  watch(event, filename) {
    console.log("this", this);
    console.log("arguments", Array.prototype.slice.call(arguments));
    this.showContent(filename);
  }

  async showContent(filename) {
    console.log("--------\n", (await readFile(filename)).toString());
  }
}

const file = new File();
// dessa forma, ele ignora o 'this' da classe file,
// herda o this da watch.
// watch(__filename, file.watch);

// alternativa para  não herdar o this da função, com o aero function
// fica horrível
// watch(__filename, (event, filename) => file.watch(event, filename));

// podemos deixar explicito qual é o contexto que a função vai executar.
// Toda vez que a gente for delegar a execução da função, é sempre importante
// passar o contexto no qual queremos que a função seja executada, pois
// assim não temos problemas com recuperação de contexto.

// o bind retorna uma função com o 'this' que se mantém de file, ignorando o watch.
// watch(__filename, file.watch.bind(file));

// .call (this (contexto que ele tem)) > substitui o comportamento.
file.watch.call(
  { showContent: () => console.log("call: hey sinon") },
  null,
  __filename
);

// .apply => mesma coisa
file.watch.apply({ showContent: () => console.log("call: hey sinon") }, [
  null,
  __filename,
]);
