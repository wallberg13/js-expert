import { pipeline } from "stream/promises";
import { setTimeout } from "timers/promises";

async function* myCustomReadable() {
  yield Buffer.from("This is my");
  await setTimeout(1000);
  yield Buffer.from(" first async iterator");
}

async function* myCustomTransform(stream) {
  for await (const chunk of stream) {
    yield chunk.toString().replace(/\s/g, "_").toUpperCase();
  }
}

/**
 * Aqui é somente um writable.
 * @param {*} stream
 */
async function* myCustomDuplex(stream) {
  let bytedRead = 0;

  /**
   * O processo do duplex writable finalizar aqui, no ultimo passo do myCustomDuplex.
   * Após este processo, quando faço o yield, estou funcionando como um readable,
   * e passando o dado para ser escrito mais na frente.
   */
  const wholeString = [];
  for await (const chunk of stream) {
    console.log("[duplex writable]", chunk);
    bytedRead += chunk.length;
    wholeString.push(chunk);
  }

  yield `wholeString: ${wholeString.join("")}`;
  yield `bytedRead: ${bytedRead}`;
}

async function* myCustomWritable(stream) {
  for await (const chunk of stream) {
    console.log("[writable]", chunk);
  }
}

/**
 * Se tem await, tem try catch.
 */

try {
  // Serve para quando eu quero cancelar uma execução.

  /**
   * Como que eu posso utilizasr isso aqui, é melhor para front end.
   */
  const controller = new AbortController();

  // Caso precise cancelar um fluxo
  // coloco um controller.abort.

  setImmediate(() => {
    controller.abort();
  });

  await pipeline(
    myCustomReadable,
    myCustomTransform,
    myCustomDuplex,
    myCustomWritable,
    { signal: controller.signal } // é sempre o final.
  );

  console.log("process has finished");
} catch (error) {
  console.error("\n Abort: ", error.message);
}
