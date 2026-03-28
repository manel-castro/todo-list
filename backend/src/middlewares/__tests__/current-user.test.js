import { jest } from "@jest/globals";

// ensure JWT secret present
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

import { currentUser } from "../current-user.js";
import { createAccessToken } from "../../services/tokens.js";

describe("currentUser middleware", () => {
  it("calls next with NotAuthorizedError when no session cookie", () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();

    currentUser(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("not-authorized");
  });

  it("sets req.currentUser and calls next when valid token", () => {
    const token = createAccessToken({ id: "42", username: "alice" });
    const req = { headers: { cookie: `session=${token}` } };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();

    currentUser(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.currentUser).toBeDefined();
    expect(req.currentUser).toHaveProperty("username", "alice");
  });

  it("deletes cookie and calls next with NotAuthorizedError when token invalid", () => {
    const req = { headers: { cookie: `session=invalidtoken` } };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();

    currentUser(req, res, next);

    expect(res.setHeader).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("not-authorized");
  });
});
