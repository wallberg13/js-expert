const { describe, it, after, before } = require("mocha");

const supertest = require("supertest");
const assert = require("assert");

describe("API Suite test", () => {
  let app;

  /**
   * O que precisamos inicializar antes de iniciar o teste.
   */
  before((done) => {
    app = require("./api");
    app.once("listening", done);
  });

  /**
   * O que precisamos finalizar depois de rodar os testes.
   */
  after((done) => app.close(done));

  describe("/contact:get", () => {
    it("should request the contact route and return HTTP status 200", async () => {
      const resp = await supertest(app).get("/contact").expect(200);

      assert.strictEqual(resp.text, "contact us page");
    });
  });

  describe("/login:post", () => {
    it("should request the login and return HTTP status 200", async () => {
      const resp = await supertest(app)
        .post("/login")
        .send({ username: "wallberg", password: "123" })
        .expect(200);

      assert.strictEqual(resp.text, "Login succeeded!");
    });

    it("should request the login and return HTTP status 401", async () => {
      const resp = await supertest(app)
        .post("/login")
        .send({ username: "xuxinha", password: "123" })
        .expect(401);

      assert.ok(resp.unauthorized);
      assert.strictEqual(resp.text, "Login failed!");
    });
  });

  describe("/hi:get - 404", () => {
    it("should request an not existing page and return HTTP Status 404", async () => {
      const resp = await supertest(app).get("/hi").expect(404);

      assert.strictEqual(resp.text, "not found!");
    });
  });
});
