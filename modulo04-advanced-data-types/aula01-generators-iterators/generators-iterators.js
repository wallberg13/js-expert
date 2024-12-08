const assert = require("assert");

function* calculation(arg1, arg2) {
  yield arg1 * arg2;
}

function* main() {
  yield "Hello";
  yield "-";
  yield "World";
  yield* calculation(20, 10); // yield* > indico que preciso executar a função que estou chamadno.
}

const generator = main();
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());

/**
 * Ao chamar a propria função com o yield, a mesma é um generator.
 * Entretanto, se eu pegar o retorno da main direto, para a variável, o mesmo
 * não realiza a interação dentro do array.
 */
// console.log(Array.from(main()))
// for (const x of main()) {
//   console.log(x);
// }
// for (const x of generator) {
//   console.log(x);
// }
assert.deepStrictEqual(generator.next(), { value: "Hello", done: false });
assert.deepStrictEqual(generator.next(), { value: "-", done: false });
assert.deepStrictEqual(generator.next(), { value: "World", done: false });
assert.deepStrictEqual(generator.next(), { value: 200, done: false });
assert.deepStrictEqual(generator.next(), { value: undefined, done: true });

assert.deepStrictEqual(Array.from(main()), ["Hello", "-", "World", 200]);
assert.deepStrictEqual([...main()], ["Hello", "-", "World", 200]);

// ---- async iterators
const { readFile, stat, readdir } = require("fs/promises");

function* promisified() {
  yield readFile(__filename);
  yield Promise.resolve("Hey Dude");
}

async function* systemInfo() {
  const file = await readFile(__filename);
  yield { file: file.toString() };

  const { size } = await stat(__filename);
  yield { size };

  const dir = await readdir(__dirname);
  yield { dir };
}

// Tem nada resolvido.
// console.log("promisified", [...promisified()]);

// Resolvendo as promisses do yield
// Promise.all([...promisified()]).then((result) => {
//   console.log("promisified", result);
// });

// (async () => {
//   for await (const item of promisified()) {
//     console.log("for await", item.toString());
//   }
// })();

(async () => {
  for await (const item of systemInfo()) {
    console.log("for await", item);
  }
})();

/**
 * Uma função com generator, geralmente, "para" de executar quando
 * encontra o primeiro "yield" dentro do fluxo de execução da mesma.
 * Até que no fluxo de execução, não tenha mais "yield" para chamar.
 * É como se a função ficasse esperando ela ser chamada, e parasse o ponteiro
 * de execução naquele momento.
 */
