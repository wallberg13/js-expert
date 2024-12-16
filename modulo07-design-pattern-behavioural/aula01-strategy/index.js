import ContextStrategy from "./src/base/contextStrategy.js";
import MongoDBStrategy from "./src/strategies/mongoDBStrategy.js";
import PostgresStrategy from "./src/strategies/postgresStrategy.js";

/**
 * O stategy: não é uma herança direto.
 * Ele cria uma classe "intermediaria", que possui
 * as mesmas assinaturas das classes "filhas". Para generalizar algo.
 *
 * Padrão de composição, pois nesse caso, eu só preciso da implementação
 * dos dois, e os dois não possuem relação entre si.
 */
const postgresConnectionstring =
  "postgres://wall:senha0001@localhost:5432/heroes";
const postgresContext = new ContextStrategy(
  new PostgresStrategy(postgresConnectionstring)
);
await postgresContext.connect();

const mongoDBConnectionString =
  "mongodb://wall:senhaadmin@localhost:27017/heroes";
const mongoDBContext = new ContextStrategy(
  new MongoDBStrategy(mongoDBConnectionString)
);
await mongoDBContext.connect();

const data = [
  {
    name: "wallberg",
    type: "transaction",
  },
  {
    name: "ticotico",
    type: "activityLog",
  },
];

const contextTypes = {
  transaction: postgresContext,
  activityLog: mongoDBContext,
};

for (const { type, name } of data) {
  const context = contextTypes[type];
  await context.create({ name: name + Date.now() });
  console.log(type, context.dbStrategy.constructor.name);
  console.log(await context.read());
}

// await postgresContext.create({ name: data[0].name });
// console.log(await postgresContext.read());
// await mongoDBContext.create({ name: data[1].name });
// console.log(await mongoDBContext.read());
