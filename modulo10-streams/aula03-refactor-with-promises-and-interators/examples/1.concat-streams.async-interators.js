import { pipeline } from "stream/promises";
import axios from "axios";

const API_01 = "http://localhost:3000";
const API_02 = "http://localhost:4000";

// Aqui não é api rest, é pegar dados sob demanda.

const requests = await Promise.all([
  axios({
    method: "get",
    url: API_02,
    responseType: "stream",
  }),
  axios({
    method: "get",
    url: API_01,
    responseType: "stream",
  }),
]);

// RegeX => (:"(?<name>.*)(?=-))
// Array de Readable Streams.
const results = requests.map(({ data }) => data);

// writable stream
async function* output(stream) {
  for await (const data of stream) {
    // ?=- => Ele faz procurar a partir do - e olhar para trás.
    // (?<name>.*) => procura pelo o conteudo dentro das aspas apos o : extrai somente o name (atributo nomeado)
    const name = data.match(/:"(?<name>.*)(?=-)/).groups.name;
    console.log(`[${name.toLowerCase()}] ${data}`);
  }
}

// passthrough > junta todos os streams.
/**
 * Basicamente:
 * - Pega todos os readable e transforma em "for await"
 * => Repara: em streams, ele possui mais de uma func, e está passando direto.
 *
 * OBS: não é concorrente, está sendo executado sequencialmente, logo, não existe uma
 * "junção de stream".
 */
async function* merge(streams) {
  // Lista de streams
  for (const readable of streams) {
    readable.setEncoding("utf8");

    for await (const chunk of readable) {
      for (const line of chunk.trim().split(/\n/)) {
        yield line;
      }
    }
  }
}

await pipeline(merge(results), output);
