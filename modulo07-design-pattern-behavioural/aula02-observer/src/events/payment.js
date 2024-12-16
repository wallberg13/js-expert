export default class Payment {
  // Quando um pagamento for comunicado, preciso notificar tudo.
  constructor(paymentSubject) {
    this.paymentSubject = paymentSubject;
  }

  creditCard(paymentData) {
    console.log(`\na payment ocurred from ${paymentData.userName}`);
    this.paymentSubject.notify(paymentData);
  }
}
