#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const hero = ({ name, age, power }) => ({ name, age, power, id: Date.now() });

const { argv } = yargs(hideBin(process.argv))
  .command("createHero", "create a hero", (builder) => {
    return builder
      .option("name", {
        alias: "n",
        demandOption: true,
        describe: "hero name",
        type: "string",
      })
      .option("age", {
        alias: "a",
        demandOption: true,
        describe: "hero age",
        type: "number",
      })
      .option("power", {
        alias: "p",
        demandOption: true,
        describe: "hero power",
        type: "string",
      })
      .example(
        'createHero --name "John Doe" --age 20 --power "fly"',
        "create a hero"
      )
      .example('createHero -n "John Doe" -a 20 -p "fly"');
  })
  .epilog("Copyright (c) 2025 Wallberg Morais");

console.log(hero(argv));
