import OrderBusiness from "./business/orderBusiness.js";
import Order from "./entities/order.js";

const order = new Order({
  customerId: "1234",
  amount: 200.0,
  products: [{ description: "shampoo" }],
});

const orderBusiness = new OrderBusiness();
console.info("orderBusiness", orderBusiness.create(order));
