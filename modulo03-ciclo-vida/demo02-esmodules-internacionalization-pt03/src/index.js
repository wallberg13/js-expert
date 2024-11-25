import database from "./../database.json";
import Person from "./person.js";
import TerminalController from "./terminalController.js";
import { save } from "./repository.js";

const DEFAULT_LANG = "pt-BR";
const STOP_TERM = ":q";

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANG);

// Usa recursão para simular o looping infinito, mas não acho uma boa
// pois caso o programa rodar por muito tempo, vai acabar estourando alguma pilha
// de execução.
async function mainLoop() {
  try {
    const answer = await terminalController.question();

    if (answer === STOP_TERM) {
      terminalController.closeTerminal();
      console.log("process finished!");
      return;
    }

    const person = Person.generateInstanceFromString(answer);
    terminalController.updateTable(person.formatted(DEFAULT_LANG));
    await save(person);
    // console.log("person", person.formatted(DEFAULT_LANG));
  } catch (e) {
    console.error("DEU RUIM**", e);
  }

  return mainLoop();
}

await mainLoop();
