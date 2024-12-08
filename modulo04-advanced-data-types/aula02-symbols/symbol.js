const assert = require("assert");

// --keys
// Toda vez que usamos um "Symbol", nós estamos criando
// um endereço unico na memoria.
// O symbol meio que cria um "campo privado", ou seja, um endereço de memoria só dele.
// No objeto, cada chave criada com "symbol" são únicas, não importa se com nomes iguais.
const uniqueKey = Symbol("userName");
const uniqueKey2 = Symbol("userName");
const user = {};

user["userName"] = "value for normal objects";
user[uniqueKey] = "value for symbol";
user[uniqueKey2] = "value for symbol 2";

// console.log("getting normal Objects", user.userName);
// console.log("getting normal Objects", user[Symbol("userName")]); // Mas aqui estou criando outro symbol
// console.log("getting normal Objects", user[uniqueKey]); // Mas aqui estou criando outro symbol

assert.deepStrictEqual(user.userName, "value for normal objects");
// Sempre único em nível de endereço de memoria, apesar de ser o nosso "symbol"
assert.deepStrictEqual(user[Symbol("userName")], undefined);
assert.deepStrictEqual(user[uniqueKey], "value for symbol");

// console.log(user);
// console.log("symbols", Object.getOwnPropertySymbols(user));

// é dificil pegar no que tem no symbol, mas não é secreto,.
// console.log("symbols", Object.getOwnPropertySymbols(user)[0]);
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// byPass - má prática (nem tem no codebase do node)
// console.log(user[Symbol.for("password")]);
// SymbolFor permite que o "Symbol" não seja criado diretamente na memoria.
user[Symbol.for("password")] = 123;
assert.deepStrictEqual(user[Symbol.for("password")], 123);

// Well Known Symbols

const obj = {
  // iterators
  // É o que o * faz debaixo dos panos.
  [Symbol.iterator]: () => ({
    items: ["c", "b", "a"],
    next() {
      return {
        done: this.items.length === 0,
        // remove o ultimo e retorna.
        value: this.items.pop(),
      };
    },
  }),
};

// O que o for of faz...
// for (const item of obj) {
//   console.log("item", item);
// }
assert.deepStrictEqual([...obj], ["a", "b", "c"]);

const kItems = Symbol("kItems");
class MyDate {
  // args=> ano, mes, dia
  constructor(...args) {
    this[kItems] = args.map((arg) => new Date(...arg));
  }

  // Para imprimir aquela tag: [object Object]
  get [Symbol.toStringTag]() {
    return "WHAT??";
  }

  // Para fazer conversões de tipos, para caso de typecasts.
  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== "string") throw new TypeError();

    const itens = this[kItems].map((item) =>
      new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(item)
    );

    // Formatando lista em formato ptBR, com um "e" no final.
    return new Intl.ListFormat("pt-BR", {
      style: "long",
      type: "conjunction",
    }).format(itens);
  }

  // Essa função vamos fazer para ser executada com yield.
  // validar que é um interador. Substituindo o comportamento padrão do
  // objeto.
  *[Symbol.iterator]() {
    console.log("Symbol.iterator");

    for (const item of this[kItems]) {
      yield item;
    }
  }

  // Com promises do mesmo jeito.
  // Para await ou forAwait
  // Podemos até alterar o comportamento caso tivessemos dentro de um
  // assync iterator.
  async *[Symbol.asyncIterator]() {
    console.log("Symbol.asyncIterator");
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }
}

const myDate = new MyDate([2020, 3, 1], [2018, 2, 2]);
const expectedDates = [new Date(2020, 3, 1), new Date(2018, 2, 2)];

// console.log(myDate);

/**
 * Como definir métodos privados raiz com JS.
 *
 * Primeiro, cria os symbols necessários fora da classe (como constantes),
 * depois: caso o symbol seja propriedade privada da classe, cria com this[<symbol>] = initialValue.
 * caso seja um metodo: [{symbol}]() {}
 */

// Chamando o toString do myDate?
assert.deepStrictEqual(
  Object.prototype.toString.call(myDate),
  "[object WHAT??]"
);
assert.throws(() => myDate + 1, TypeError);

// Coercao explicita
assert.deepStrictEqual(
  String(myDate),
  "01 de abril de 2020 e 02 de março de 2018"
);

// console.log("String(myDate)", String(myDate));
assert.deepStrictEqual([...myDate], expectedDates);

// (async () => {
//   for await (const item of myDate) {
//     console.log("asyncIterator", item);
//   }
// })();

/**
 * Um detalhe aqui, o ...myDate não chama o asyncIterator, e sim
 * o iterator normal..., pois primeiro faz o spread, e o resultado
 * dele é colocado dentro do array que está no promise all.
 */
(async () => {
  const dates = await Promise.all([...myDate]); // o spread operator chama next next até achar um fim...
  assert.deepStrictEqual(dates, expectedDates);
})();

(async () => {
  const dates = [];

  for await (const date of myDate) {
    dates.push(date);
  }

  const expectedDatesInISOString = expectedDates.map((item) =>
    item.toISOString()
  );

  assert.deepStrictEqual(dates, expectedDatesInISOString);
})();
