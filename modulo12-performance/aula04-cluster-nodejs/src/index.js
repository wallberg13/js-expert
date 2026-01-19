import os from "os";
import cluster from "cluster";
import { initializeServer } from "./server.js";

(() => {

  // Se não for o processo main, o orquestrador
  // ele pode criar novas cópias.
  if (!cluster.isPrimary) {
    initializeServer();
    return;
  }

  const cpusNumber = os.cpus().length;
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking for ${cpusNumber} CPUs`);

  for (let i = 0; i < 8; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {

    // Se o worker morreu com erro, vamos criar um novo.
    // Ou se o worker morreu por causa de um SIGTERM, SIGINT, etc.
    // Ou se o worker morreu por causa de um timeout.
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
      cluster.fork();
    }
  });

})();