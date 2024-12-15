const { expect } = require("chai");
const { describe, it } = require("mocha");
const { productValidator } = require("../src");
const ProductDataBuilder = require("./model/productDataBuilder");

describe("Test Data Builder", () => {
  it("shouldn't return error with valid product", () => {
    // Retorna dados default
    const product = ProductDataBuilder.aProduct().build();

    const result = productValidator(product);

    const expected = {
      errors: [],
      result: true,
    };

    expect(result).to.be.deep.equal(expected);
  });

  describe("Product Validation Rules", () => {
    it("should return an object error when creating a Product with invalid id", () => {
      // Retorna dados default
      const product = ProductDataBuilder.aProduct().withInValidId().build();

      const result = productValidator(product);

      const expected = {
        errors: [
          "id: invalid length, current [1] expected to be between 2 and 20",
        ],
        result: false,
      };

      expect(result).to.be.deep.equal(expected);
    });

    it("should return an object error when creating a Product with invalid name", () => {
      // Retorna dados default
      const product = ProductDataBuilder.aProduct().withInValidName().build();

      const result = productValidator(product);

      const expected = {
        errors: [
          "name: invalid value, current [abc123] expected to have only words",
        ],
        result: false,
      };

      expect(result).to.be.deep.equal(expected);
    });

    it("should return an object error when creating a Product with invalid price", () => {
      // Retorna dados default
      const product = ProductDataBuilder.aProduct().withInvalidPrice().build();

      const result = productValidator(product);

      const expected = {
        errors: [
          "price: invalid value, current [2000] expected to be between 1 and 1000",
        ],
        result: false,
      };

      expect(result).to.be.deep.equal(expected);
    });

    it("should return an object error when creating a Product with invalid category", () => {
      // Retorna dados default
      const product = ProductDataBuilder.aProduct()
        .withInvalidCategory()
        .build();

      const result = productValidator(product);

      const expected = {
        errors: [
          "category: invalid value, current [caralho] expected to be either eletronic or organic",
        ],
        result: false,
      };

      expect(result).to.be.deep.equal(expected);
    });
  });
});
