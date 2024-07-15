const { describe, it, before, beforeEach, afterEach } = require("mocha");
const CarService = require("./../../src/service/carService");
const Transaction = require("./../../src/entities/transaction");
const { join } = require("path");
const { expect } = require("chai");
const sinon = require("sinon");

const carsDatabase = join(__dirname, "./../../database", "cars.json");

const mocks = {
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCar: require("./../mocks/valid-car.json"),
  validCustomer: require("./../mocks/valid-customer.json"),
};

// Classes abstratas não fazem sentidos serem testadas, e sim as classes com as implementações.

describe("CarService Suite Tests", () => {
  /** @type {CarService} */
  let carService = {};

  /** @type {sinon.SinonSandbox} */
  let sandbox = {};

  before(() => {
    carService = new CarService({
      cars: carsDatabase,
    });
  });

  /**
   * Before e AfterIt faz com que a gente possa limpar os dados
   * antes e depois de cada teste.
   */
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should retrieve a random position from an array", () => {
    const data = [0, 1, 2, 3, 4];

    const result = carService.getRandomPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  /**
   * Explicando esse teste:
   * - O que precisamos aqui é verificar se o id escolhido está de acordo
   * com o ID selecionado.
   * Como já testamos o getRandomPosition, a gente já tem como expectativa, que
   * o mesmo está funcionando corretamente, logo, aqui neste cenário, iremos realizar
   * um stub para definir uma saída padrão para esse cara.
   *
   * O stub também funciona como um spie
   */
  it("should choose the first id from carIds in carCategory", () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIdIndex);

    const result = carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });

  it("given a carCategory it should return an available car", async () => {
    const car = mocks.validCar;

    // Vamos criar um objeto imutável.
    // E vamos passar o ids da categoria o unico id de car.
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });

  /**
   * Esse teste possui como objetivo, calcular os preços corretos
   * dado uma entrada. Então aqui valida se a formula de calculo está correto.
   * Caso alguém alterar a classe de taxas em si, esse teste não vai
   * ser afetado.
   */
  it("give a carCategory, customer and numberOfDays it should calculate final amount in real", async () => {
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50; //

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;

    // age: 50 - 1.3 tax - categoryPrice 37.6
    // 37.6 * 1.3 =48,88 * 5 days = 244.40

    // não depender de dados externos;
    sandbox
      .stub(carService, "taxesBasedOnAge")
      .get(() => [{ from: 40, to: 50, then: 1.3 }]);

    const expected = carService.currencyFormat.format(244.4);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    expect(result).to.be.deep.equal(expected);
  });

  /**
   * O ObjectCreate é justamente para podermos alterar o objeto mocado
   * sem alterar a propriedade do objeto raiz, assim, não afetando os demais testes.
   */
  it("given a customer and a car category it should return a transaction receipt", async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id],
    };

    const customer = Object.create(mocks.validCustomer);
    customer.age = 20;

    const numberOfDays = 5;
    const dueDate = "10 de novembro de 2020";

    const now = new Date(2020, 10, 5);
    // Mocka as datas para essa data criada anteriormente.
    sandbox.useFakeTimers(now.getTime());

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    // age 20,
    const expectedAmount = carService.currencyFormat.format(206.8);
    const result = await carService.rent(customer, carCategory, numberOfDays);
    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });

    expect(result).to.be.deep.equal(expected);
  });
});
