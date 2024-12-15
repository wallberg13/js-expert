const ProductDataBuilder = require("./productDataBuilder");

class ProductMotherObject {
  static valid() {
    return ProductDataBuilder.aProduct().build();
  }

  static withInvalidId() {
    return ProductDataBuilder.aProduct().withInValidId().build();
  }

  static withInvalidName() {
    return ProductDataBuilder.aProduct().withInValidName().build();
  }

  static withInvalidPrice() {
    return ProductDataBuilder.aProduct().withInvalidPrice().build();
  }

  static withInvalidCategory() {
    return ProductDataBuilder.aProduct().withInvalidCategory().build();
  }
}

module.exports = ProductMotherObject;
