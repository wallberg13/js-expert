"use strict";

const Event = require("events");
const event = new Event();
const eventName = "counter";
event.on(eventName, (msg) => console.log("counter updated", msg));

// event.emit(eventName, "oi");
// event.emit(eventName, "tchau");

// Objeto que quero que seja observado.
const myCounter = {
  counter: 0,
};

// Para frontend, é bom ser utilizado para
// notificar tudo ao mesmo tempo. Muito bom.
const proxy = new Proxy(myCounter, {
  set: (target, propertyKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertyKey] });
    target[propertyKey] = newValue;
    return true;
  },
  get: (object, prop) => {
    // console.log("chamou!!", { object, prop });
    return object[prop];
  },
});

// Para fazer um clearInterval, dentro do proprio
// interval, basta chamar o parametro como function.
// Pois o function roda no mesmo contexto.
// set interval => futuro e vai acabar executando.
setInterval(function () {
  proxy.counter += 1;
  console.log("[3]: setInterval");
  if (proxy.counter === 10) {
    clearInterval(this);
  }
}, 200);

// jajá e sempre
setImmediate(() => {
  console.log("[1]: setImmediate", proxy.counter);
});

// SetTimeout com 0 para sair executando, não é uma boa pratica.
// futuro
setTimeout(() => {
  proxy.counter = 4;
  console.log("[2] timeout!");
}, 100);

// executa agora, agorinha, mas acaba com o ciclo de vida do node
// prioridade total.
process.nextTick(() => {
  proxy.counter = 2;
  console.log("[0]: nextTick");
});

// Ciclo de Vida:
// Coloquei um setInterval + nextTick.
// O nextTick executou primeiro, pois tem prioridade no ciclo de vida
// do node, já o setInterval não.
// Prioridade: nextTick, setTimeout, setImmediate e setInterval.
