const { evaluateRegex } = require("./util");
const Person = require("./person");

/**
 * O objetivo do FluentAPI é executar tarefas como
 * um pipeline, step by step e no fim, chama o build. Muito
 * similar ao padrao builder.
 *
 * A diferença que aqui é sobre processos, o Build sobre construção
 * de objetos.
 */
class TextProcessorFluentAPI {
  // propriedade privada!
  #content;

  constructor(content) {
    this.#content = content;
  }

  extractPeopleData() {
    // ?<= fala que vai extrair os dados que virão depois desse grupo
    // [contratante|contratado] ou um ou outro, (e tem a flag no fim da expressao para pegar maiusculo ou minusculo)
    // :\s{1} vai procurar o caracter literal do dosi pontos seguindo de um espaço
    // tudo acima fica dentro de um parenteses para falar "vamos pegar daí para frente"
    // (?!\s) negative look around, vai ignorar os contratantes do fim do documento (que tem só espaço a frente deles)
    // .*\n pega qualquer coisa até o primeiro \n
    // .*?  non greety, esse ? faz com que ele pare na primeira recorrencia, assim ele evita ficar em loop.

    // $ informar que a pesquisa acaba no fim da linha
    // g -> global
    // m -> multiline
    // i -> insensitive

    const matchPerson = evaluateRegex(
      /(?<=[contratante|contratado]:\s{1})(?!\s)(.*\n.*?)$/gim
    );

    // faz o match para encontrar a string inteira que contem os dados que precisamos.
    const onlyPerson = this.#content.match(matchPerson);

    // Para cada passo, o método final chamado, no caso, o build
    // vai pegar o conteudo atualizado.
    // Logo, no fluentAPI, sempre vamos ficar alterando a informação dentro da classe
    // e trabalhando em formas de pipelines em cima da mesma.
    this.#content = onlyPerson;

    return this;
  }

  divideTextInColumns() {
    const splitRegex = evaluateRegex(/,/);
    this.#content = this.#content.map((line) => line.split(splitRegex));
    return this;
  }

  removeEmptyCharacteres() {
    const trimSpaces = evaluateRegex(/^\s+|\s+$|\n/g);
    this.#content = this.#content.map((line) =>
      line.map((item) => item.replace(trimSpaces, ""))
    );
    return this;
  }

  mapPerson() {
    // Nosso person no construtor já receber o array em ordem.
    this.#content = this.#content.map((line) => new Person(line));

    return this;
  }

  build() {
    return this.#content;
  }
}

module.exports = TextProcessorFluentAPI;
