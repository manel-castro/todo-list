import { jest } from "@jest/globals";
import { Password } from "../password.js";

describe("Password service", () => {
  it("hashes and verifies passwords", async () => {
    const plain = "password";
    const hashed = await Password.toHash(plain);
    expect(typeof hashed).toBe("string");

    const ok = await Password.compare(hashed, plain);
    expect(ok).toBe(true);

    const bad = await Password.compare(hashed, "wrong");
    expect(bad).toBe(false);
  });
});
