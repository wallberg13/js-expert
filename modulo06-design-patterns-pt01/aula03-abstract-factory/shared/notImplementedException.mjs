export default class NotImplementedException extends Error {
  constructor(message) {
    super(`the "${message}" function was now implemented.`);
    this.name = "NotImplementedException";
  }
}
