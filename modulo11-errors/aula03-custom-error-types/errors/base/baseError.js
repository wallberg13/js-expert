class BaseError extends Error {
  constructor({ name, message }) {
    super(message);

    this.name = this.name;
  }
}

export default BaseError;