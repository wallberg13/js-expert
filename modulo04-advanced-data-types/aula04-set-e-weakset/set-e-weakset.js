const assert = require("assert");

// usando na maioria das vezes para Lista de Itens unicos
const arr1 = ["0", "1", "2"];
const arr2 = ["2", "0", "3"];
const arr3 = arr1.concat(arr2);

// console.log("arr3.sort", arr3.sort());
// console.log("arr3", arr3);
assert.deepStrictEqual(arr3.sort(), ["0", "0", "1", "2", "2", "3"]);

const set = new Set();
arr1.map((item) => set.add(item));
arr2.map((item) => set.add(item));

// O set parece ser um array, mas acaba sendo objecto.
// console.log("Set with added items", set);
assert.deepStrictEqual(Array.from([...set]), ["0", "1", "2", "3"]);

// rest/spread
assert.deepStrictEqual(Array.from(new Set([...arr1, ...arr2])), [
  "0",
  "1",
  "2",
  "3",
]);

// Ambos retorna a mesmas coisas
// No fim, o set e o map trabalham bem parecidos.
// So set, temos o conjunto em objeto e no map os conjuntos em array.
// console.log("set.values", set.values()); // Só existe por conta do Map.
// console.log("set.keys", set.keys());

// No Array comum, para saber se um item existe.
assert.ok(set.has("3"));

// mesma teoria do map, mas você sempre trabalha com a lista
// toda, não tem get, então você pode saber se o tiem está ou não no array e é isso.
// na documentação tem exemplos sobre como fazer uma interceção, saber o que tem uma lista
// e não tem na outra e assim por diante.

// tem nos dois arrays
const users01 = new Set(["erick", "mariazinha", "wallzinho"]);
const users02 = new Set(["tyyy", "xxxx", "wallzinho"]);

// Pegando a intersection dos dois.
// Mais perfomatico do que 2 filter e 2 for.
const intersection = new Set([...users01].filter((user) => users02.has(user)));
assert.deepStrictEqual(Array.from(intersection), ["wallzinho"]);

// Diference - o que nao tem em um e tem no outro.
// => Fica muito simples e performático de usar set para diff e intersection.
const difference = new Set([...users01].filter((user) => !users02.has(user)));
assert.deepStrictEqual(Array.from(difference), ["erick", "mariazinha"]);
console.log(difference);

// WeakSet => mesma ideia do WeakMap
// não é enumerável (iterável)
// só trabalha com chaves como referencia
// só tem métodos simples

const user = { id: 123 };
const user2 = { id: 321 };

// WeakSet e o WeakMap são casos raros de serem utilizados
// mas são bastante vistos no código base do node, pois lá possui
// o objetivo de termos algo perfomático.
const weakSet = new WeakSet([user]);
weakSet.add(user2);
weakSet.delete(user);
weakSet.has(user);
