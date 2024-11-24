import TerminalController from "./terminalController.js";
import database from "./../database.json";
import Person from "./person.js";

const DEFAULT_LANG = "pt-BR";
const STOP_TERM = ":q";

// > Puramente demonstrativo de como funciona...
// setInterval(() => {
//   database.push({ id: Date.now(), vehicles: ["Teste" + Date.now()] });
//   const table = chalkTable(options, database);
//   print(table);
// }, 500);

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANG);

async function mainLoop() {
  try {
    const answer = await terminalController.question();

    if (answer === STOP_TERM) {
      terminalController.closeTerminal();
      console.log("process finished!");
      return;
    }

    const person = Person.generateInstanceFromString(answer);
    console.log("person", person.formatted(DEFAULT_LANG));
  } catch (e) {
    console.error("DEU RUIM**", e);
  }

  return mainLoop();
}

await mainLoop();
