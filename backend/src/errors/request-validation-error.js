import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(errors) {
    super("error-parameters");

    this.errors = errors || [];

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      // @ts-ignore
      return { message: err.msg, field: err.path };
    });
  }
}
