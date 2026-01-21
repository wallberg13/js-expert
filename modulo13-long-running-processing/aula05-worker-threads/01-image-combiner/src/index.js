import { createServer } from 'http';
import { parse, fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import { dirname } from 'path'

// https://sharp.pixelplumbing.com/install#worker-threads
import 'sharp';


const currentFolder = dirname(fileURLToPath(import.meta.url)); // Não entendi o pq disso;
const workerFileName = 'worker.js'


/**
 * Lembrando: 
 * WorkerThreads são melhores para processamento pesado com CPU intensive operations.
 */

/**
 * Estou subindo uma thread para cada requisição
 * O que não é ideal.
 */


/**
 * LIB: 
 * PISCINA
 * => POOL DE THREADS 
 */

async function joinImages(images) {

  return new Promise((resolve, reject) => {
    const worker = new Worker(`${currentFolder}/${workerFileName}`);
    worker.postMessage(images);
    worker.once('message', resolve); // Quando vier uma mensagem, o worker vai ter terminado, e vamos resolver a promise.
    worker.once('error', reject); // Se der erro, vamos rejeitar a promise.
    worker.once('exit', code => { // Se o worker terminar, vamos verificar se o código de saída é diferente de 0, se for, vamos rejeitar a promise.
      if (code !== 0) {
        return reject(new Error(`Worker ${worker.threadId} stopped with exit code ${code}`));
      }

      console.log(`Worker ${worker.threadId} stopped with exited!`);
    })
  })

}

async function handler(request, response) {
  if (request.url.includes('joinImages')) {
    const { query: { img, background } } = parse(request.url, true); // Já entrega o pacote pronto pra nós
    const imageBase64 = await joinImages({
      image: img,
      background
    })

    // response.end(JSON.stringify(imageBase64))
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`<img style="width:100%;height:100%;" src="data:image/jpeg;base64,${imageBase64}"/>`)
    return;
  }

  return response.end('ok');
}

createServer(handler).listen(3000, () => {
  console.log('Server is running on port 3000');
});







