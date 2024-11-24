const assert = require("assert");
const obj = {};
const arr = [];
const fn = () => {};

// internamente, objetos literais viram funções explicitas
console.log("new Object() is {}?", new Object().__proto__ === {}.__proto__);

// Realmente igual
assert.deepStrictEqual(new Object().__proto__, {}.__proto__);

// __proto__ é a referencia do objeto que possui as propriedades deles.
console.log(
  "obj.__proto__ === Object.prototype",
  obj.__proto__ === Object.prototype
);
assert.deepStrictEqual(obj.__proto__, Object.prototype);

console.log(
  "arr.__proto__ === Array.prototype",
  arr.__proto__ === Array.prototype
);
assert.deepStrictEqual(arr.__proto__, Array.prototype);

console.log(
  "fn.__proto__ === Function.prototype",
  fn.__proto__ === Function.prototype
);
assert.deepStrictEqual(fn.__proto__, Function.prototype);

// o __proto__ do Object.prototype é null > Todo mundo herda de null.
console.log("obj.__proto__.__proto__", obj.__proto__.__proto__ === null);
assert.deepStrictEqual(obj.__proto__.__proto__, null);

//------------
console.log("----------");

function Employee() {}
Employee.prototype.salary = () => "salary**";
// console.log(Employee.prototype.salary());

// Herda a instancia de employee
function Supervisor() {}
Supervisor.prototype = Object.create(Employee.prototype); // Herança na raça./
Supervisor.prototype.profitShare = () => "profitShare**"; // Herança na raça./
Supervisor.prototype.profitShare2 = () => "profitShare2**"; // Herança na raça./
// console.log(Supervisor.prototype.profitShare());

// Herda o prototype de Supervisor.
function Manager() {}
Manager.prototype = Object.create(Supervisor.prototype); // Herança na raça./
Manager.prototype.monthlyBonuses = () => "monthlyBonuses**"; // Herança na raça./

// Podemos chamar direto via prototype, mas se tentar chamar direto dá erro.
console.log("Manager.prototype.salary()", Manager.prototype.salary());
// console.log("Manager.prototype.salary()", Manager.salary());

// se não chamar o 'new', o primeiro __proto__ vai ser sempre a instnacia de
// function, sem herdar nossas classes.
// Para acessar as classes sem o new, pode acessar direto via prototype.
console.log(
  "Manager.prototype.__proto__ === Supervisor.prototype",
  Manager.prototype.__proto__ === Supervisor.prototype
);
assert.deepStrictEqual(Manager.prototype.__proto__, Supervisor.prototype);

console.log("--------");
// quando chamamos com o 'new', o __proto__ recebe o prototype
console.log(
  "manager.__proto__: %s, manager.salary(): %s",
  new Manager().__proto__,
  new Manager().salary()
);
console.log(
  "Supervisor.prototype === new Manager().__proto__.__proto__",
  Supervisor.prototype === new Manager().__proto__.__proto__
);
assert.deepStrictEqual(Supervisor.prototype, new Manager().__proto__.__proto__);

// O "__proto__" é a propria propriedade do objeto.
// Se eu sair de "__proto__" em "__proto__" (uma lista encadeada) , eu vou ficar
// Ainda não sei a pegada do prototype e o proto.
// __proto__ > é a instancia de prototype. É como se, ao dar um "new", ele "redeclarasse" todas as funções criadas no "prototype".
// O prototype é como se fosse um modelo da classe (só que ele é linearizado, pelo o que entendi.)
console.log("-----");
const manager = new Manager();
console.log("manager.salary()", manager.salary());
console.log("manager.profitShare()", manager.profitShare());
console.log("manager.monthlyBonuses()", manager.monthlyBonuses());

assert.deepStrictEqual(manager.__proto__, Manager.prototype);
assert.deepStrictEqual(manager.__proto__.__proto__, Supervisor.prototype);
assert.deepStrictEqual(
  manager.__proto__.__proto__.__proto__,
  Employee.prototype
);
assert.deepStrictEqual(
  manager.__proto__.__proto__.__proto__.__proto__,
  Object.prototype
);
assert.deepStrictEqual(
  manager.__proto__.__proto__.__proto__.__proto__.__proto__,
  null
);

console.log("-------");

class T1 {
  ping() {
    return "ping";
  }
}

class T2 extends T1 {
  pong() {
    return "pong";
  }
}

class T3 extends T2 {
  shoot() {
    return "shoot";
  }
}

const t3 = new T3();
console.log(
  "t3 inherits null?",
  t3.__proto__.__proto__.__proto__.__proto__.__proto__ === null
);
console.log("t3.ping()", t3.ping());
console.log("t3.pong()", t3.pong());
console.log("t3.shoot()", t3.shoot());
assert.deepStrictEqual(t3.__proto__, T3.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__, T2.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__, T1.prototype);
assert.deepStrictEqual(
  t3.__proto__.__proto__.__proto__.__proto__,
  Object.prototype
);
assert.deepStrictEqual(
  t3.__proto__.__proto__.__proto__.__proto__.__proto__,
  null
);
