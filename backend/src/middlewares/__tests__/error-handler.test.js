import { jest } from "@jest/globals";
import { errorHandler } from "../error-handler.js";
import { CustomErrorTest } from "./mocks/custom-error-test.js";

describe("errorHandler middleware", () => {
  it("returns generic error for unknown errors", () => {
    const err = new Error();
    const req = {};
    const send = jest.fn();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ send, json });
    const res = { status };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith({
      errors: [{ message: "generic-error" }],
    });
  });

  it("returns specific error for correct classes", () => {
    const err = new CustomErrorTest([{ msg: "test error", path: "test" }]);
    const req = {};
    const send = jest.fn();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ send, json });
    const res = { status };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith({
      errors: [{ message: "test error", field: "test" }],
    });
  });
});
