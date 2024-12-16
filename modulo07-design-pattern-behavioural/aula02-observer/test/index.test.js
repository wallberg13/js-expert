import { expect, describe, test, jest, beforeAll } from "@jest/globals";
import PaymentSubject from "../src/subjects/paymentSubject.js";
import Payment from "../src/events/payment.js";
import Shipment from "../src/observers/shipment.js";
import Marketing from "../src/observers/marketing.js";

describe("Test Suite for Observer Pattern", () => {
  // Removendo o console log. Com spyOn (existe uma estrutura que faz esse tipo
  // de coisa e que foi ensinada no modulo de advanced data types)
  beforeAll(() => {
    jest.spyOn(console, console.log.name).mockImplementation(() => {});
  });

  test("#PaymentSubject notify observers", () => {
    const subject = new PaymentSubject();

    const observer = {
      update: jest.fn(),
    };

    const data = "hello world";
    const expected = data;

    // Vamos subescrever, e depois ser notificado.
    subject.subscribe(observer);
    subject.notify(data);

    expect(observer.update).toBeCalledWith(expected);
  });

  test("#PaymentSubject should not notify unsubscribed observers", () => {
    const subject = new PaymentSubject();

    const observer = {
      update: jest.fn(),
    };

    const data = "hello world";

    // Vamos subescrever, e depois ser notificado.
    subject.subscribe(observer);
    subject.unsubscribe(observer);
    subject.notify(data);

    expect(observer.update).not.toHaveBeenCalled();
  });

  test("#Payment should notify subject after a credit card transaction", () => {
    const subject = new PaymentSubject();

    const payment = new Payment(subject);

    const paymentSubjectNotifierSpy = jest.spyOn(
      payment.paymentSubject,
      payment.paymentSubject.notify.name
    );

    const data = { userName: "wallberg", id: Date.now() };

    // Eu espero que, uma função seja chamada, após uma compra
    // de cartão de crédito ter sido realizada.
    payment.creditCard(data);

    expect(paymentSubjectNotifierSpy).toBeCalledWith(data);
  });

  test("#All should notify subscribers after a credit card payment", () => {
    const subject = new PaymentSubject();
    const shipment = new Shipment();
    const marketing = new Marketing();

    const shipmentSpy = jest.spyOn(shipment, shipment.update.name);
    const marketingSpy = jest.spyOn(marketing, marketing.update.name);

    // Colocando as notificações
    subject.subscribe(shipment);
    subject.subscribe(marketing);

    const payment = new Payment(subject);
    const data = { userName: "wallberg", id: Date.now() };

    payment.creditCard(data);

    // Espero que tenha sido notificado.
    expect(shipmentSpy).toBeCalledWith(data);
    expect(marketingSpy).toBeCalledWith(data);
  });
});
