export default class PaymentSubject {
  #observers = new Set();

  notify(data) {
    this.#observers.forEach((observer) => observer.update(data));
  }

  // O set é com referencias, logo, preciso ter controle das referencias de acesso
  // Mas geralmente, faço esse controle com objetos.
  unsubscribe(observable) {
    this.#observers.delete(observable);
  }

  subscribe(observable) {
    this.#observers.add(observable);
  }
}
