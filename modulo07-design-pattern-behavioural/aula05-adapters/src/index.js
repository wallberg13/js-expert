import RickAndMortyBRLAdapter from "./business/adapter/rickAndMortyBRLAdapter.js";
import RickAndMortyUSAAdapter from "./business/adapter/rickAndMortyUSAAdapter.js";

const data = [RickAndMortyBRLAdapter, RickAndMortyUSAAdapter].map((int) =>
  int.getCharacters()
);

const all = await Promise.allSettled(data);

const successes = all
  .filter(({ status }) => status === "fulfilled")
  .map(({ value }) => value)
  .reduce((prev, next) => prev.concat(next), []);

const errors = all.filter(({ status }) => status === "rejected");

console.table(successes);
console.table(errors);
