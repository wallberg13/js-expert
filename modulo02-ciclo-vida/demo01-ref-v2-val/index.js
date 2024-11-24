const { deepStrictEqual } = require("assert");

//************> Passagem por valor
let counter = 0;
let counter2 = counter;
counter2++;

// ? - Counter: 0 / Counter2 = 1

//************> Passagem por referencia
const item = { counter: 0 };
const item2 = item;

// Tipo primitivo gera uma cópia em memória
deepStrictEqual(counter, 0);
deepStrictEqual(counter2, 1);

// Tipo de referência, copia o endereço de memória
// e aponta para o mesmo lugar
item2.counter++;
deepStrictEqual(item, { counter: 1 });
item.counter++;
deepStrictEqual(item2, { counter: 2 });
