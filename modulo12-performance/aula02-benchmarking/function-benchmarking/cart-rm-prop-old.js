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
    const productsEntites = products
      .filter(product => !!Reflect.ownKeys(product).length) // Filtrando somente os produtos que possuem chaves
      .map(product => new Product(product))

    return JSON.parse(JSON.stringify(productsEntites));
  }
}