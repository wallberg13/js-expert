import timers from "timers/promises";

const timeoutAsync = timers.setTimeout;

setTimeout(async () => {
  // Se der um erro aqui, o que ocorre...
  console.log("staging process!!");
  await timeoutAsync(100);
  console.count("debug");
  console.log(await Promise.resolve("timeout order!"));
  await timeoutAsync(100);
  console.count("debug");

  /**
   * O node não tratou o evento.
   */
  await Promise.reject("promise rejected on timeout");
}, 1000);

const throwError = (msg) => {
  throw new Error(msg);
};

try {
  console.log("hello world");
  console.log("hello world");
  throwError("error dentro do try/catch!");
} catch (error) {
  console.log("pego no catch!", error.message);
} finally {
  console.log("executed after all!");
}

process.on("unhandledRejection", (e) => {
  console.log("unhandled rejection!", e.message || e);
});

/**
 * Qual a diferença entre o await Promise.reject para o Promise.reject?
 */
process.on("uncaughtException", (e) => {
  console.log("uncaught exception!", e.message || e);
  process.exit(1); // Derruba a aplicação.
});

// Aqui para tudo - Só pega um erro e para o processo.
await Promise.reject("promise rejected do carai de aza");

// O que ocorre quando dou um:

// se o promise.reject estiver dentro de outro contexto, ele cai no unhandledRejection
setTimeout(async () => {
  await Promise.reject("promise async/awaitrejected!");
});

// mas se ele estiver no contexto global, ele cai no uncaughtException
// await Promise.reject("promise async/awaitrejected!");

// uncaughtException
setTimeout(() => {
  throwError("error dentro do timeout!");
});
