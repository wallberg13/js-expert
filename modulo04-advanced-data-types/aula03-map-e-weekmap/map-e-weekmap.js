const assert = require("assert");

const myMap = new Map();

// podem ter qualquer coisa como chave.

myMap
  .set(1, "one")
  .set("Wall", { text: "berg" })
  .set(true, () => "hellow");

const myMapWithConstructor = new Map([
  ["1", "str1"],
  [1, "num1"],
  [true, "bool1"],
]);

// console.log("myMap", myMap);
// console.log("myMapWithConstructor", myMapWithConstructor.get(1));
assert.deepStrictEqual(myMap.get(1), "one");
assert.deepStrictEqual(myMap.get("Wall"), { text: "berg" });
assert.deepStrictEqual(myMap.get(true)(), "hellow");

// Em objects a chave só pode ser string ou symbol (number é coergido a string)
const onlyReferenceWork = { id: 1 };
myMap.set(onlyReferenceWork, { name: "Wall Berg" });

assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWork), { name: "Wall Berg" });

// Utilitários
// - No Object seria o Object.keys({a: 1}).length
assert.deepStrictEqual(myMap.size, 4);

// Para verificar se um item existe no objeto
// item.key = se não existe = undefined
// if () = coerção implicita para boolean e retorna false.
// O jeito certo em Object é Object é ({name: 'Wall'}).hasOwnProperty('name')
assert.ok(myMap.has(onlyReferenceWork));

// Para remover um item do objecto.
// delete item.id

// imperformático para o javascript
assert.ok(myMap.delete(onlyReferenceWork));

// Não dá para iterar em Objects diretamente
// tem que transformar com o Object.entries()
assert.deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify([
    [1, "one"],
    ["Wall", { text: "berg" }],
    [true, () => {}],
  ])
);

// Map implementa iterator nativamente.
// for (const [key, value] of myMap) {
//   console.log({ key, value });
// }

// Object é inseguro, pois dependendo do nome da chave, pode substituir algum
// comportamento padrão.
// ({}).toString() => '[object Object]'
// ({toString: () => 'Hey'}).toString() === 'Hey'
// Qualquer chave pode colidir, com as propriedades herdadas do objeto, como
// constructor, toString, valueOf e etc.
const actor = {
  name: "Xuxa da Silva",
  toString: "Queen: Xuxa da Silva",
};

myMap.set(actor);

assert.ok(myMap.has(actor));
assert.throws(() => myMap.get(actor).toString, TypeError);

// Não dar para limpar um Obj sem reassina-lo
myMap.clear();
assert.deepStrictEqual([...myMap.keys()], []);
console.log(myMap);

// Uso de Map: usar chaves com frequencia (add e remover)
// Preciso limpar referencias após o uso.
// Se eu preciso somente adicionar e remover e pesquisar chaves, posso usar o Weekmap.

// Weekmap só uso objetos como chave, e poucas funções, e não tem iterador.

// --- WeakMap

// Poder ser coletado após perder as referencias
// usado em casos bem especificos (como na errors da Node)

// tem a maioria dos beneficios do Map
// MAS: não é iterável
// Só chves de referencia e que você já conheça
// mais leve e preve leak de memoria, pq depois que as instancias saem da memoria,
// tudo é limpo dentro dele.

const weakMap = new WeakMap();
const hero = { name: "Flash" };

// weakMap.set(hero);
// weakMap.get(hero);
// weakMap.delete(hero);
// weakMap.has(hero);
