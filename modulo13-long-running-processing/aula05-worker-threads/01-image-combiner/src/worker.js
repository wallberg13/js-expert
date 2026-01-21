import { parentPort } from 'worker_threads'
import sharp from 'sharp';
import axios from 'axios';

/**
 * A thread roda com a versão do arquivo que está sendo executado
 * Se eu tinha uma thread com uma versão de arquivo, e mudei o arquivo, a proxima thread
 * criada já vai rodar com a nova versão do arquivo.
 */

async function downloadFile(url) {
  // Vamos pegar a stream do arquivo e processar em memoria
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  return response.data
}

async function onMessage({ image, background }) {
  const firstLayer = await sharp(await downloadFile(image))
    // .grayscale()
    // .resize(100, 100)
    .toBuffer();

  const secondLayer = await sharp(await downloadFile(background))
    .composite([
      {
        input: firstLayer,
        gravity: sharp.gravity.south // Deixar a imagem na parte de baixo
      },
      {
        input: firstLayer,
        gravity: sharp.gravity.north // Deixar a imagem na parte de cima
      },
      {
        input: firstLayer,
        gravity: sharp.gravity.east // Deixar a imagem na parte de baixo
      },
      {
        input: firstLayer,
        gravity: sharp.gravity.west // Deixar a imagem na parte de baixo
      }
    ])
    .toBuffer();



  // console.log(firstLayer)

  // const imageBuffer = await downloadFile(image);
  // const backgroundBuffer = await downloadFile(background);
  console.log('enviando imagem', firstLayer.length)

  parentPort.postMessage(secondLayer.toString('base64'))
}

parentPort.on('message', onMessage);