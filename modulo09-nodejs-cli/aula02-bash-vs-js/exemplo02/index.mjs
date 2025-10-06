#!/usr/bin/env zx

// (?<containerId>\w+)\W+(?=nginx)
// ?= => positive lookahead => vai pegar o containerId.
// \W+ => pega qualquer coisa que não seja um espaço.
// nginx => vai pegar o nginx.
// npm config set --init-author-name=wallberg13

import { setTimeout } from "timers/promises";
import isSafe from "safe-regex";

await $`docker run -p "8080:80" -d nginx`;
await setTimeout(500);

const req = await $`curl --silent http://localhost:8080`;
console.log(req.stdout);

const containers = await $`docker ps`;

// const exp = /(?<containerId>\w+)\W+(?=nginx)(x+x+)+y/gi; => Unsafe
const exp = /(?<containerId>\w+)\W+(?=nginx)/;

if (!isSafe(exp)) {
  throw new Error("Regex is not safe");
}

const {
  groups: { containerId },
} = containers.toString().match(exp);

const logs = await $`docker logs ${containerId}`;
console.log("logs:\n", logs.stdout);

const rm = await $`docker rm -f ${containerId}`;
console.log("rm -f:\n", rm.stdout);

// // CONTAINER_ID=$(docker ps | grep nginx | awk '{print $1}') # awk print $1 => retorna a primeira coluna.
// // echo logs
// // echo $CONTAINER_ID | xargs -I {id} docker logs {id} # xargs => utiliza como parametro o id do container.
// // echo rm
// // echo $CONTAINER_ID | xargs -I {id} docker rm -f {id} # xargs => utiliza como parametro o id do container.
