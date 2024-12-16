import Payment from "./events/payment.js";
import Marketing from "./observers/marketing.js";
import Shipment from "./observers/shipment.js";
import PaymentSubject from "./subjects/paymentSubject.js";

const subject = new PaymentSubject();
const marketing = new Marketing();

subject.subscribe(marketing);

const shipment = new Shipment();
subject.subscribe(shipment);

const payment = new Payment(subject);

payment.creditCard({ userName: "wall berg", id: "1233" });

subject.unsubscribe(marketing);

// só vai disparar para a area de shipment
payment.creditCard({ userName: "caraiozinho", id: "caraio" });
