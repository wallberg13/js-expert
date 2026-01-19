import { createServer } from 'http';

import Events from 'events';
import { randomBytes } from 'crypto';

const myEvent = new Events();

function getBytes() {
  return randomBytes(10000);
}

function onData() {
  getBytes();
  const items = [];

  setInterval(function myInterval
    () { items.push(Date.now()) });
}


/**
 * Programar sem função anônima, para entender onde que está o problema.
 */

createServer(function handler(request, response) {
  myEvent.on('data', onData);

  myEvent.emit('data', Date.now());

  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello World');
}).listen(3000, () => {
  console.log('Server is running on port 3000');
});


// clinic doctor--help       ==> Analise da Aplicação.
// clinic bubbleprof--help   ==> Analise da Aplicação relacionado à dependencias.
// clinic clean--help        ==> Limpa o cache da aplicação.
// clinic flame--help        ==> Mesmo que o 0x, mas mais completo.
// clinic heapprofiler--help ==> Analise da Memoria da Aplicação