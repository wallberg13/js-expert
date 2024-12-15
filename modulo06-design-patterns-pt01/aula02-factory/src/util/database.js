class Database {
  constructor({ connectionString }) {
    this.connectionString = connectionString;
  }

  async sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async connect() {
    await this.sleep(100);
    return this;
  }

  async find(query) {
    await this.sleep(100);
    return [{ name: "Wall Berg" }];
  }
}

module.exports = Database;
