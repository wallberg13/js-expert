
import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'


async function handle(req, res) {
  const fileName = `file-${randomUUID()}.csv`;
  await pipeline(
    req,
    createWriteStream(fileName)
  )

  res.end('upload with success!')
}

createServer(handle).listen(3000, () => console.log('Server is running on port 3000'))
