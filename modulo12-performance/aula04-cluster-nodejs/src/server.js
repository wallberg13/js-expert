import { createServer } from 'http';
import { appendFile } from 'fs/promises';

export function initializeServer() {
  async function handler(request, response) {
    await appendFile('./log.txt', `processed by ${process.pid}\n`);

    const result = Array.from({ length: 1e4 }, () => Math.floor(Math.random() * 40)).reduce((acc, curr) => acc + curr, 0);

    response.end(`${result}`);
  }

  // Essa porta vai ser simbolica.
  createServer(handler).listen(3000, () => {
    console.log(`Server is running on port 3000 and pid ${process.pid}`);
  });

  setTimeout(() => process.exit(1), Math.random() * 1e4);
}
