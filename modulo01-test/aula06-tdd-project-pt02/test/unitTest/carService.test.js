const { describe, it, before, beforeEach, afterEach } = require("mocha");
const CarService = require("./../../src/service/carService");

const { join } = require("path");
const { expect } = require("chai");
const sinon = require("sinon");

const carsDatabase = join(__dirname, "./../../database", "cars.json");

const mocks = {
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCar: require("./../mocks/valid-car.json"),
  validCustomer: require("./../mocks/valid-customer.json"),
};

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
});
