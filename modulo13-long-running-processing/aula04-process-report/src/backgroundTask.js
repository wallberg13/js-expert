import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Writable, Transform } from 'stream';
import csvtojson from 'csvtojson';
import { setTimeout } from 'timers/promises';

const database = process.argv[2];

// Aqui estamos fazendo um stream de stream;
// Primeiro vamos ler todo o arquivo mesmo?
// De uma só vez, estranho

async function onMessage(msg) {
  const firstTimeRan = [];

  await pipeline(
    createReadStream(database),
    csvtojson(), // Um JSON string
    Transform({
      transform(chunk, encoding, cb) {
        const data = JSON.parse(chunk);


        if (data.Name !== msg.Name) {
          return cb(); // Ignora o chunk, e espera o próximo chegar.
        }

        // Se está duplicado, passo para frente o nome do pokemon
        if (firstTimeRan.includes(data.Name)) {
          return cb(null, msg.Name);
        }

        firstTimeRan.push(data.Name);

        // Caso contrário, ignoro. OBS: só quero passar para frente os iguais.
        cb();
      }
    }),
    Writable({
      write(chunk, encoding, cb) {
        process.send(chunk.toString());
        return cb()
      }
    })
  )
}

/**
 * Todas as mensagens que o pai mandar, vão chegar aqui.
 * 
 * Aqui pode chegar objeto direto, sem frescura.
 */
process.on('message', onMessage);

// Para falar que o subprocesso pode morrer após inatividade.
await setTimeout(10000);
process.channel.unref(); // Se depois de 5 segundos, ele não tiver inatividade, pode morrer.