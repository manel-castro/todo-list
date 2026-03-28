import { jest } from "@jest/globals";

// ensure jwt secrets present for token creation
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.JWT_SECRET_REFRESH =
  process.env.JWT_SECRET_REFRESH || "test_jwt_refresh";

import {
  getCookieByName,
  setRefreshToken,
  setAccessToken,
  deleteCookie,
} from "../cookies.js";
import { createAccessToken, createRefreshToken } from "../tokens.js";

describe("Cookies service", () => {
  it("parses cookie string with getCookieByName", () => {
    const cookiesString = "session=sessionToken; refreshToken=refreshToken";
    expect(getCookieByName(cookiesString, "session")).toBe("sessionToken");
    expect(getCookieByName(cookiesString, "refreshToken")).toBe("refreshToken");
  });

  it("setAccessToken and setRefreshToken call res.cookie with correct names", () => {
    const res = { cookie: jest.fn(), setHeader: jest.fn() };
    const access = createAccessToken({ id: "1", username: "alice" });
    const refresh = createRefreshToken({ username: "alice" });

    setAccessToken(res, access);
    expect(res.cookie).toHaveBeenCalled();
    const args = res.cookie.mock.calls[0];
    expect(args[0]).toBe("session");
    expect(args[1]).toBe(access);

    setRefreshToken(res, refresh);
    const args2 = res.cookie.mock.calls[1];
    expect(args2[0]).toBe("refreshToken");
    expect(args2[1]).toBe(refresh);
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
