import { jest } from "@jest/globals";
// ensure secrets available
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.ACCESS_TOKEN_EXPIRATION_SECONDS =
  process.env.ACCESS_TOKEN_EXPIRATION_SECONDS || "3600";

import {
  createAccessToken,
  createRefreshToken,
  VerifyJwtToken,
} from "../tokens.js";

describe("Tokens service", () => {
  it("creates and verifies access tokens", () => {
    const token = createAccessToken({ id: "1", username: "alice" });
    expect(typeof token).toBe("string");

    const payload = VerifyJwtToken(token, process.env.JWT_SECRET);
    expect(payload).toHaveProperty("id", "1");
    expect(payload).toHaveProperty("username", "alice");
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
