// rewiremock => serve para gerar stubs
const rewiremock = require("rewiremock/node");
const { deepStrictEqual } = require("assert");

// <poderia está em outro arquivo>
const dbData = [{ name: "MariaZinha" }, { name: "Joaozim" }];
class MockDatabase {
  connect = () => this;

  find = (query) => dbData;
}

// </poderia está em outro arquivo>

// vamos interceptar para ir no banco de dados.
// O rewirtemock, meio que "muda" o comportamento da require.
// Fazendo com que o require se comporte de forma de retorna o que de fato
// precisamos.
// Logo, eu não posso ter importado a minha factory, para poder fazer o teste.
rewiremock(() => require("./../src/util/database")).with(MockDatabase);

(async () => {
  {
    const expected = [{ name: "MARIAZINHA" }, { name: "JOAOZIM" }];

    rewiremock.enable(); // Habilita o cheet
    const UserFactory = require("../src/factory/userFactory");

    const userFactory = await UserFactory.createInstance();
    const result = await userFactory.find();
    deepStrictEqual(result, expected);

    rewiremock.disable(); // Desabilita o cheet
  }

  {
    const expected = [{ name: "WALL BERG" }];

    const UserFactory = require("../src/factory/userFactory");

    const userFactory = await UserFactory.createInstance();
    const result = await userFactory.find();
    deepStrictEqual(result, expected);
  }
})();
