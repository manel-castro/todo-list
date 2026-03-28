import { jest } from "@jest/globals";

describe("validateRequest middleware", () => {
  it("throws RequestValidationError when validationResult has errors", async () => {
    const mock = {
      isEmpty: () => false,
      array: () => [{ msg: "badValidationResult", path: "pathToField" }],
    };

    jest.resetModules();
    jest.unstable_mockModule("express-validator", () => ({
      validationResult: () => mock,
    }));

    const { validateRequest } = await import("../validate-request.js");

    const req = {};
    const res = {};
    const next = jest.fn();

    expect(() => validateRequest(req, res, next)).toThrow();
  });

  it("calls next when there are no validation errors", async () => {
    const mock = { isEmpty: () => true, array: () => [] };

    jest.resetModules();
    jest.unstable_mockModule("express-validator", () => ({
      validationResult: () => mock,
    }));

    const { validateRequest } = await import("../validate-request.js");

    const req = {};
    const res = {};
    const next = jest.fn();

    validateRequest(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
