"use strict";

const assert = require("assert");

// garantir semantica e segurança em objetos.

// É algo comum, pois intercepta o comportamento padrão
// das funções para adicionar novas funções.

// Depois disso, nunca mais vamos querer usar o delete do js.

// ----- apply
const myObj = {
  add(myValue) {
    // this arg1 e arg2 não existe
    return this.arg1 + this.arg2 + myValue;
  },
};

// Com isso, quebramos tudo, pois reescrevemos o prototype.
// Function.prototype.apply = () => {
//   throw new TypeError("Eita!");
// };

// myObj.add.apply = function () {
//   throw new Error("Vixxx");
// };

// O apply: "aplica algumas variáveis dentro do this"
assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130);

// Um problema que pode acontecer (raro)
// Function.prototype.apply = () => {throw new TypeError('Eita!')}

// esse aqui pode ocorrer
myObj.add.apply = function () {
  throw new TypeError("Vixxx");
};
assert.throws(() => myObj.add.apply({}, []), {
  name: "TypeError",
  message: "Vixxx",
});

// Nos passos anteriores: alteramos o comportamento da função apply, alterando um contexto
// e quebrando a mesma.

// Usando reflect: como ele nos ajuda?
// Detalhe, não mudamos a lista 23 (não removemos o erro que adicionamos
// ao chamar o apply dentro de add.
// func, context, args
const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200]);
assert.deepStrictEqual(result, 260);
// ----- apply

// --- defineProperty

// questões semanticas
function MyDate() {}

// feio pra Kct, tudo é Object, mas Object adicionando prop para um function?
Object.defineProperty(MyDate, "withObject", { value: () => "Hey there" });

// agora faz mais sentido (é a mesma coisa) -> mas o que muda com reflect???
Reflect.defineProperty(MyDate, "withReflection", { value: () => "Hey dude" });

assert.deepStrictEqual(MyDate.withObject(), "Hey there");
assert.deepStrictEqual(MyDate.withReflection(), "Hey dude");
// --- defineProperty

// --- deleteProperty
const withDelete = { user: "WallBerg" };

// imperformático, evitar ao máximo.
delete withDelete.user;
assert.deepStrictEqual(withDelete.hasOwnProperty("user"), false);

const withReflection = { user: "Pica da Silva" };
Reflect.deleteProperty(withReflection, "user");
assert.deepStrictEqual(withReflection.hasOwnProperty("user"), false);

// --delete Property

// ----- get

// Deveriamos fazer um get somente em instancias de referencia
// Isso não faz sentido, deveria dar erro.
assert.deepStrictEqual((1)["userName"], undefined);

// com reflection, uma exceção é lançada. => Pra mim nada mudou.
assert.throws(() => Reflect.get(1, "userName"), TypeError);

// ----- get

// ----- has
// Com "in", verifico se uma chave existe dentro do objeto.
// mais feio que bater em mãe. Acredito que ele navegaria em uma lista.
assert.ok("superman" in { superman: "" });

// Aqui, "fica mais bonito", e segundo o erick wendel, performático,
// mas tudo se parece que nada muda. Além da semantica.
assert.ok(Reflect.has({ batman: "" }, "batman"));

// --- ownsKeys
const user = Symbol("user");

const databaseUser = {
  id: 1,
  [Symbol.for("password")]: 123,
  [user]: "Wall Berg",
};

// Com os métodos de object, temos que fazer 2 requisicoes para
// pegar as keys e os symbols.
// O que pode não ser legal...
const objectKeys = [
  ...Object.getOwnPropertyNames(databaseUser),
  ...Object.getOwnPropertySymbols(databaseUser),
];
assert.deepStrictEqual(objectKeys, ["id", Symbol.for("password"), user]);
// console.log("objectKeys", objectKeys);

// Com reflection, só um método.
// console.log(Reflect.ownKeys(databaseUser));
assert.deepStrictEqual(Reflect.ownKeys(databaseUser), [
  "id",
  Symbol.for("password"),
  user,
]);
