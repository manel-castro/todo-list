import { jest } from "@jest/globals";

// ensure jwt secrets present for token creation
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

import { getCookieByName, setAccessToken, deleteCookie } from "../cookies.js";
import { createAccessToken } from "../tokens.js";

describe("Cookies service", () => {
  it("parses cookie string with getCookieByName", () => {
    const cookiesString = "session=sessionToken";
    expect(getCookieByName(cookiesString, "session")).toBe("sessionToken");
  });

  it("setAccessToken calls res.cookie with correct name", () => {
    const res = { cookie: jest.fn(), setHeader: jest.fn() };
    const access = createAccessToken({ id: "1", username: "alice" });

    setAccessToken(res, access);
    expect(res.cookie).toHaveBeenCalled();
    const args = res.cookie.mock.calls[0];
    expect(args[0]).toBe("session");
    expect(args[1]).toBe(access);
  });

  it("deleteCookie sets Set-Cookie header to deleted value", () => {
    const res = { setHeader: jest.fn() };
    deleteCookie(res, "session");
    expect(res.setHeader).toHaveBeenCalled();
    const call = res.setHeader.mock.calls[0];
    expect(call[0]).toBe("Set-Cookie");
    expect(call[1][0]).toContain("session=deleted");
  });
});
