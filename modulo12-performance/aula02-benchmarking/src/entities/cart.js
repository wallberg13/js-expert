import Product from "./product.js";
import { randomUUID as uuid } from 'crypto';

export default class Cart {
  constructor({ at, products }) {
    this.id = uuid();
    this.at = at;
    this.products = this.removeUndefinedProps(products);
    this.total = this.getCartPrice();
  }

  /**
   * Má pratica
   * 
   * 2 Loops para Remover o preço
   * @param {*} products 
   * @returns 
   */
  removeUndefinedProps(products) {
    const productsEntites = products
      .filter(product => !!Reflect.ownKeys(product).length) // Filtrando somente os produtos que possuem chaves
      .map(product => new Product(product))

    return JSON.parse(JSON.stringify(productsEntites));
  }

  // Dois Loops para Remover o preço
  getCartPrice() {
    return this.products.map(product => product.price).reduce((prev, next) => prev + next, 0);
  }
}