import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import jwt from "jsonwebtoken";

// set required env vars before importing the app
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/test";
process.env.PORT = process.env.PORT || "3000";
process.env.PASSWORD_PEPPER = process.env.PASSWORD_PEPPER || "pepper_test";
process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || "10";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.JWT_SECRET_REFRESH =
  process.env.JWT_SECRET_REFRESH || "test_jwt_refresh";
process.env.ACCESS_TOKEN_EXPIRATION_SECONDS =
  process.env.ACCESS_TOKEN_EXPIRATION_SECONDS || "3600";
process.env.REFRESH_TOKEN_EXPIRATION_SECONDS =
  process.env.REFRESH_TOKEN_EXPIRATION_SECONDS || String(60 * 60 * 24 * 30);

import app from "../../../../app.js";
import User from "../../../../models/User.js";

jest.setTimeout(30000);

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let coll of collections) {
    await coll.deleteMany({});
  }
});

describe("Auth routes", () => {
  it("register sets session and refreshToken cookies", async () => {
    const agent = request.agent(app);

    const res = await agent.post("/api/auth/register").send({
      username: "alice",
      password: "password1",
    });

    expect(res.status).toBe(201);
    const cookies = res.headers["set-cookie"] || [];
    const hasSession = cookies.some((c) => c.startsWith("session="));
    const hasRefresh = cookies.some((c) => c.startsWith("refreshToken="));
    expect(hasSession).toBe(true);
    expect(hasRefresh).toBe(true);

    // extract session token and verify payload
    const sessionCookie = cookies.find((c) => c.startsWith("session="));
    const sessionMatch =
      sessionCookie && sessionCookie.match(/session=([^;]+)/);
    expect(sessionMatch).toBeTruthy();
    const sessionToken = sessionMatch[1];

    // Verify token
    const payload = jwt.verify(sessionToken, process.env.JWT_SECRET);
    expect(payload).toHaveProperty("username", "alice");
    expect(payload).toHaveProperty("id");
  });

  it("login sets cookies when credentials valid", async () => {
    // create user directly
    const hashed = "pwhashed";
    // use Password service normally, but creating user with raw hashed value is fine
    await User.create({
      username: "bob",
      password: await (async () => {
        // reuse the app's Password service to hash properly
        const { Password } = await import("../../../../services/password.js");
        return Password.toHash("password2");
      })(),
    });

    const agent = request.agent(app);
    const res = await agent.post("/api/auth/login").send({
      username: "bob",
      password: "password2",
    });

    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("session="))).toBe(true);
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
  });

  it("logout clears cookies when called with existing cookies", async () => {
    const agent = request.agent(app);

    // register to get cookies
    const reg = await agent.post("/api/auth/register").send({
      username: "carol",
      password: "password3",
    });
    expect(reg.status).toBe(201);

    // logout using agent so cookies are sent
    const out = await agent.post("/api/auth/logout").send();
    expect(out.status).toBe(200);

    const cookies = out.headers["set-cookie"] || [];
    // cookies should be cleared (set-cookie includes session=; or expires in past)
    const clearedSession = cookies.some(
      (c) =>
        c.startsWith("session=deleted") ||
        /session=.*Expires|Expires/.test(c) ||
        /session=;/.test(c),
    );
    const clearedRefresh = cookies.some(
      (c) =>
        c.startsWith("refreshToken=deleted") ||
        /refreshToken=.*Expires|Expires/.test(c) ||
        /refreshToken=;/.test(c),
    );
    expect(clearedSession || clearedRefresh).toBe(true);
  });
});
