import { CustomError } from "../../../errors/custom-error";

export class CustomErrorTest extends CustomError {
  statusCode = 400;

  constructor(errors) {
    super("custom-error-test");

    this.errors = errors || [];

    Object.setPrototypeOf(this, CustomErrorTest.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      // @ts-ignore
      return { message: err.msg, field: err.path };
    });
  }
}
