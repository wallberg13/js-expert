// Responsável por fazer toda gerencia do padrão de projeto.

const Product = require("../../src/entities/product");

/**
 * Estou entendendo que esse padrão de object mother, é basicamente para
 * facilitar os testes na hora de criar os casos de uso da funcionalidade que estou
 * testando. Até agora não consegui ver a real utilidade disso, mas tbm não finalizei a aula.
 */

class ProductDataBuilder {
  constructor() {
    // o default sao os dados corretos
    // o caso de sucesso

    this.productData = {
      id: "000001",
      name: "computer",
      price: 900,
      category: "electronic",
    };
  }

  static aProduct() {
    return new ProductDataBuilder();
  }

  withInValidId() {
    this.productData.id = "1";

    return this;
  }

  withInValidName() {
    this.productData.name = "abc123";

    return this;
  }

  withInvalidPrice() {
    this.productData.price = 2000;

    return this;
  }

  withInvalidCategory() {
    this.productData.category = "caralho";

    return this;
  }

  build() {
    const product = new Product(this.productData);
    return product;
  }
}

module.exports = ProductDataBuilder;
