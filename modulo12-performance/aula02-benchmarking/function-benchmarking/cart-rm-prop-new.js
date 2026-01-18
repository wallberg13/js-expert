import Product from "../src/entities/product.js";


export default class Cart {
  constructor({ products }) {
    this.products = this.removeUndefinedProps(products);
  }

  /**
   * Má pratica
   * 
   * 2 Loops para Remover o preço
   * @param {*} products 
   * @returns 
   */
  removeUndefinedProps(products) {
    const result = [];
    for (const product of products) {
      const keys = Reflect.ownKeys(product);

      if (!keys.length) {
        continue;
      }

      // 3 Abordagem:
      // keys.forEach(key => product[key] || Reflect.deleteProperty(product, key));

      // 2 Abordagem: keys.forEach(key => product[key] || delete product[key]);
      // result.push(new Product(product));

      // 4 Abordagem:
      let newObject = {};
      keys.forEach(key => {
        if (!keys[key]) return;

        newObject[key] = product[key];
      });
      result.push(new Product(newObject));

      // 1 Abordagem: result.push(JSON.parse(JSON.stringify(new Product(product))));
    }

    return result;
  }
}