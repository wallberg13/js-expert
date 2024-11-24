9999999999999999; // 16
// 10000000000000000
true + 2;
// 3
"21" + true;
// '21true'
"21" - true;
// 20
"21" - -1;
// 22
0.1 + 0.2 === 0.3;
// false

3 > 2 > 1;
// false

3 > 2 >= 1;
// true

"B" + "a" + +"a" + "a";
// 'BaNaNa'

"1" == 1; // true
"1" === 1; // false

// https://wtfjs.com;

// --------------
// Conversão explicita: String(123)
// console.assert(String(123) === "123", "explicit convertion to string");
// console.assert(String(123) === "123a", "explicit convertion to string");
// console.assert(123 + "" === "123", "implicit convertion to string");

// console.assert(("hello" || 123) === "hello", "|| returns the first element!");
// console.assert(("hello" && 123) === 123, "&& returns the last element!");

// if (null || 1) {
//   // true
//   console.log("ae!!");
// }

// if ("hello" || 1) {
//   // true
//   console.log("ae2!!");
// }

// --------------

/**
 * Em objetos,
 * para tipos númericos (ou operações númericas),
 * primeiro é chamado o valueOf, e caso o mesmo não retornar um
 * tipo primitivo, ele retorna o toString.
 */
const item = {
  name: "Wall Morais",
  age: 29,

  // string: 1 se nao for primitivo, chama o valueOf
  toString() {
    return `Name: ${this.name}, Age: ${this.age}`;
  },

  // number: 1 se não for primitivo, chama o toString
  valueOf() {
    return { hey: "dude" };
    // return 7;
  },

  // Ele tem prioridade na execução das conversões
  // Uma vez esse cara declarado, ele ignora totalmente o toString e o valueOf
  [Symbol.toPrimitive](coercionType) {
    console.log("trying to convert to", coercionType);
    const types = {
      string: JSON.stringify(this),
      number: "0007",
    };

    return types[coercionType] || types.string; // O default > é sempre para boolean
  },
};

// console.log("toString", String(item));
// console.log("valueOf", Number(item));

// depois de adicionar o toPrimitive
// console.log("String", String(item));
// console.log("Number", Number(item));

// // Chama a conversão default.
// console.log("Date", new Date(item));

// Aqui ele chamou o default.
console.assert(item + 0 === '{"name":"Wall Morais","age":29}0');
console.assert(!!item);

// console.log("string.concat", "Ae".concat(item));
console.assert("Ae".concat(item) === 'Ae{"name":"Wall Morais","age":29}');

// console.log("implicit + explicit coercion (using ==)", item == String(item));
// console.assert(item == String(item));

const item2 = { ...item, name: "Zezin", age: 20 };
// console.log("New Object", item2);
console.assert(item2.name === "Zezin" && item2.age === 20);
