import { fork } from 'child_process'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import csvtojson from 'csvtojson';
import { Writable } from 'stream';

const database = './data/All_Pokemon.csv';
const PROCESS_COUNT = 30;
const backgroundTaskFile = './src/backgroundTask.js';
const replications = [];

// Os Child Process são processos filhos que são criados pelo processo pai.
// Os mesmos conseguem se comunicar com o processo pai através de mensagens.

/**
 * Talvez, seja interessante utilizar ChildProcess para rodar as conexões das OLTs
 * para sempre ficar disponível uma conexão para quando eu precisar.
 * 
 * Já que, eu posso enviar objetos...
 */


/**
 * Objetivo:
 * Ser um arquivo de pokemons, enviar em paralelo para X processos, 
 * para cada processo ler novamente o arquivo, e enviar para frente apenas os pokemons iguais.
 */

const processes = new Map();
for (let i = 0; i < PROCESS_COUNT; i++) {
  const child = fork(backgroundTaskFile, [database]);


  child.on('exit', () => {
    console.log(`Process ${child.pid} exited`)
    processes.delete(child.pid);
  })

  child.on('error', error => {
    console.log(`Process ${child.pid} has an error`, error)
    process.exit(1);
  });


  child.on('message', msg => {
    // Work around para multiprocessamento.
    if (replications.includes(msg)) {
      return;
    }

    console.log(`Process ${child.pid} has a new replicant: `, msg)
    replications.push(msg);
  })
  processes.set(child.pid, child);
}

// 
// 100 Mensagens, 10 processos
// Distribuição de carga de forma igualitária
//
// Array, index inicial do RR
function roundRobin(array, index = 0) {
  return function () {
    if (index >= array.length) index = 0;

    return array[index++]
  }
}

// Pool de Conexões, ou load balancer
const getProcess = roundRobin([...processes.values()]);

console.log(`Starting with ${processes.size} processes`);

await pipeline(
  createReadStream(database), // lendo o arquivo
  csvtojson(), // convertendo o json para csv => Para cada linha, ele mete ficha => Ele é um transform stream
  Writable({
    write(chunk, encoding, cb) {
      const chosenProcess = getProcess();
      chosenProcess.send(JSON.parse(chunk));
      cb();
    }
  })
)