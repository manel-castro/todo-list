import { jest } from "@jest/globals";
import { requireAuth } from "../require-auth.js";

describe("requireAuth middleware", () => {
  it("calls next with NotAuthorizedError when no currentUser", () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.constructor.name).toBe("NotAuthorizedError");
  });

  it("calls next without error when currentUser exists", () => {
    const req = { currentUser: { id: "1" } };
    const res = {};
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
