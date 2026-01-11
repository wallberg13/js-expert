import { Writable, PassThrough } from "stream";
import axios from "axios";

const API_01 = "http://localhost:3000";
const API_02 = "http://localhost:4000";

// Aqui não é api rest, é pegar dados sob demanda.

const requests = await Promise.all([
  axios({
    method: "get",
    url: API_01,
    responseType: "stream",
  }),
  axios({
    method: "get",
    url: API_02,
    responseType: "stream",
  }),
]);
// RegeX => (:"(?<name>.*)(?=-))
// Array de Readable Streams.
const results = requests.map(({ data }) => data);

const output = Writable({
  write(chunk, encoding, cb) {
    /**
     * @type {string}
     */
    const data = chunk.toString().replaceAll("\n", "");

    // ?=- => Ele faz procurar a partir do - e olhar para trás.
    // (?<name>.*) => procura pelo o conteudo dentro das aspas apos o : extrai somente o name (atributo nomeado)
    const name = data.match(/:"(?<name>.*)(?=-)/).groups.name;
    console.log(`[${name.toLowerCase()}] ${data}`);

    // como usar com async await
    cb();
  },
});

// PassThrough => é um stream que passa os dados para frente, sem modificar nada.
function merge(streams) {
  return streams.reduce((prev, current, index, items) => {
    // impede que a stream feche sozinha.
    current.pipe(prev, { end: false });

    // Só finalizo a stream anterior, quando todas as outras streams
    // estiverem fechadas. Basicamente: a stream raiz: é o passThrough.

    /**
     * OBS do Erick:
     *
     * como colocamos end: false, vamos manipular manualmente quando o nosso current
     * terminar. Quando ele terminar, vamos verificar se todos no pipeline se encerraram,
     * então, ele vai forçar a cadeia do anterior a se fechar.
     */
    current.on("end", () => items.every((s) => s.ended) && prev.end());

    // OBS: items: streams que estou manipulando.
    //       prev: o passthrough que está sendo manipulado e recebendo toda a caralhada de streams.

    return prev;
  }, new PassThrough()); // todo mundo dar pipe no passThrough.
}

merge(results).pipe(output);
