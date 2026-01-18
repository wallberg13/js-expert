export default class Cart {
  constructor({ products }) {

    this.products = products;
    this.total = this.getCartPrice();
  }

  // Dois Loops para Remover o preço
  getCartPrice() {
    let price = 0;
    for (const product of this.products) {
      if (!product.price) continue;

      price += product.price;
    }

    return price;
  }
}