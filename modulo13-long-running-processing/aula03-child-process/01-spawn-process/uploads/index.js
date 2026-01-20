import { spawn } from "child_process";

const pythonFile = "index.py";
const pythonCommand = "python3";

// O spawn serve para executar comandos do sistema operacional.

async function requestPython({ url, headers, filePath }) {

  /**
   * O spawn retorna um objeto com os seguintes atributos:
   * - stdin: stream de entrada
   * - stdout: stream de saída
   * - stderr: stream de erro
   * - pid: id do processo
   * - signal: sinal do processo
   * - spawnargs: argumentos do spawn
   * - spawnfile: arquivo que foi executado
   * - spawnpath: path do arquivo que foi executado
   * - spawnoptions: opções do spawn
   * - spawnstatus: status do processo
   * - spawnerror: erro do processo
   * - spawnsignal: sinal do processo
   * - spawnclose: fechamento do processo
   * - spawndisconnect: desconexão do processo
   * - spawnexit: saída do processo
   * - spawnkill: matando o processo
   * 
   * basicamente, ele poe para rodar, e recebe um stream para que a gente possa monitorar
   * o que está acontecendo de fora.
   */
  const py = spawn(pythonCommand, [
    pythonFile,
    JSON.stringify({ url, headers, filePath })
  ]);

  const dataString = [];
  for await (const chunk of py.stdout) {
    dataString.push(chunk.toString());
  }

  return dataString.join("");
}

const result = await requestPython({
  url: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json"
  },
  filePath: "./my-data.csv"
});

console.log('result', result);