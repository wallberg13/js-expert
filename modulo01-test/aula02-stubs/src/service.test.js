const Service = require("./service");
const assert = require("assert");

const BASE_URL_1 = "https://swapi.dev/api/planets/1";
const BASE_URL_2 = "https://swapi.dev/api/planets/2";

const { createSandbox } = require("sinon");
const sinon = createSandbox();
const mocks = {
  alderaan: require("../mocks/alderaan.json"),
  tatooine: require("../mocks/tatooine.json"),
};

/**
 * No contexto dos STUBS,
 * a gente está meio que criando sim uma resposta viciada, mas a intenção é que,
 * a gente consiga fazer testes que realize testes na nossa regra de negócio em si,.
 */
(async () => {
  // {
  //   // vai para a internet!!
  //   const service = new Service();
  //   const dados = await service.makeRequest(BASE_URL_2);
  //   console.log("dados", JSON.stringify(dados));
  // }

  /**
   * Inicializando nossos stubs.
   */
  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  // Caso, a função que estou fazendo o stub, seja chamada com
  // esse argumento, então vamos resolver a promisse com esse resultado
  // exibido.
  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine);

  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan);

  {
    const expected = {
      name: "Tatooine",
      surfaceWater: "1",
      appeardIn: 5,
    };

    /**
     * Fizemos o stub mas chamamos o método getPlanets.
     * A intenção disso, é que a getPlanets me trás os dados tratados, e dentro
     * da getPlanets, é feito o makeRequest e depois é feito o tratamento dos dados.
     */
    const results = await service.getPlanets(BASE_URL_1);

    assert.deepStrictEqual(results, expected);
  }

  {
    const expected = {
      name: "Alderaan",
      surfaceWater: "40",
      appeardIn: 2,
    };

    /**
     * Fizemos o stub mas chamamos o método getPlanets.
     * A intenção disso, é que a getPlanets me trás os dados tratados, e dentro
     * da getPlanets, é feito o makeRequest e depois é feito o tratamento dos dados.
     */
    const results = await service.getPlanets(BASE_URL_2);

    assert.deepStrictEqual(results, expected);
  }
})();
