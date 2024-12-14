const { evaluateRegex } = require("./util");

class Person {
  // (\w+):\s.*, => $1,
  constructor([
    nome,
    nacionalidade,
    estadoCivil,
    documento,
    rua,
    numero,
    bairro,
    estado,
  ]) {
    // (\w+), => this.$1 = $1

    // ^        => começo da string
    // +        => um ou mais ocorrencias
    // (\w{1})  => pega só a primeira letra e deixa em um grupo
    // (a-zA-Z) => encontra letras maiusculas ou minusculas, adicionamos o + pra ele pegar todas até o caracter especial
    // g        => todas as ocorrencias que encontrar
    const firstCoverLeter = evaluateRegex(/^(\w{1})([a-zA-Z]+$)/);
    const formatFirstLetter = (prop) => {
      return prop.replace(
        firstCoverLeter,
        (fullMatch, group1, group2, index) => {
          return `${group1.toUpperCase()}${group2.toLowerCase()}`;
        }
      );
    };

    // \D => tudo que NÃO é digito (valor maiusculo).

    this.nome = nome;
    this.nacionalidade = formatFirstLetter(nacionalidade);
    this.estadoCivil = formatFirstLetter(estadoCivil);

    // tudo que não for digito vira vazio
    // \g serve para remover todas as ocorrencias que encontrar
    this.documento = documento.replace(evaluateRegex(/\D/g), "");

    // Melhor usar join para pegar o unico valor.
    // começa a procurar depois do " a " e pega tudo o que tem a frente.
    // é como se o que tiver para tras, "não existe" na string
    // (?<= faz com que ignore tudo que tiver antes desse match)
    // conhecido como positive lookbehind
    this.rua = rua.match(evaluateRegex(/(?<=\sa\s).*$/)).join();
    this.numero = numero;

    // começa a buscar depois do espaço e pega qualquer letra ou digito
    // até o fim da linha (poderia ser o .* tbm)
    this.bairro = bairro.match(evaluateRegex(/(?<=\s).*$/)).join();

    // remove o ponto literal (.) do fim da frase.
    this.estado = estado.replace(evaluateRegex(/\.$/), "");
  }
}

module.exports = Person;
