import DraftLog from "draftlog";
import chalk from "chalk";
import chalkTable from "chalk-table";
import readline from "readline";
import database from "./../database.json";
import Person from "./person.js"; // Em ECMA Script Module, sempre precisamos passar a extensão do arquivo.

DraftLog(console).addLineListener(process.stdin);

const DEFAULT_LANG = "pt-BR";
const options = {
  leftPad: 2,
  columns: [
    { field: "id", name: chalk.cyan("ID") },
    { field: "vehicles", name: chalk.magenta("Vehicles") },
    { field: "kmTraveled", name: chalk.cyan("Km Traveled") },
    { field: "from", name: chalk.cyan("Vehicles") },
    { field: "to", name: chalk.cyan("Vehicles") },
  ],
};

const table = chalkTable(
  options,
  database.map((item) => new Person(item).formatted(DEFAULT_LANG))
);
const print = console.draft(table);

// > Puramente demonstrativo de como funciona...
// setInterval(() => {
//   database.push({ id: Date.now(), vehicles: ["Teste" + Date.now()] });
//   const table = chalkTable(options, database);
//   print(table);
// }, 500);

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

terminal.question("Qual é o seu nome? ", (msg) => {
  console.log("msg", msg.toString());
});
