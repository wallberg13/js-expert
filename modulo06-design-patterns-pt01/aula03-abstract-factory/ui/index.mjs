import { database } from "../shared/data.mjs";

// A Application não faz ideia do que tem "por trás."
class Application {
  constructor(factory) {
    this.table = factory.createTable();
  }

  initialize(database) {
    this.table.render(database);
  }
}

(async function main() {
  // Como descobrir a plataforma.
  const path = globalThis.window ? "browser" : "console";

  // Importação dinamica de código. Como dentro de cada
  // viewFactory é só um apelido
  const { default: ViewFactory } = await import(
    `./../platforms/${path}/index.mjs`
  );

  const app = new Application(new ViewFactory());
  app.initialize(database);
})();
