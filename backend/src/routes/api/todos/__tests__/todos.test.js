import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import User from "../../../../models/User.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../../../services/tokens.js";
import { Password } from "../../../../services/password.js";
import app from "../../../../app.js";

// ensure env vars required by app are set before importing
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

// allow more time for mongodb-memory-server to download/start
jest.setTimeout(30000);

// helper to create a user and return cookie header with signed tokens
const getCookieHeader = async (username, password = "password1") => {
  const agent = request.agent(app);

  const res = await agent.post("/api/auth/register").send({
    username: username,
    password: password,
  });

  expect(res.status).toBe(201);
  const cookies = res.headers["set-cookie"] || [];

  return cookies;
};

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

describe("POST /api/todos/add", () => {
  it("returns 400 when title is missing", async () => {
    const cookieHeader = await getCookieHeader("user1");

    const res = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookieHeader)
      .send({ description: "x", responsible: "y" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("required-title");
  });

  it("returns 400 when description is missing", async () => {
    const cookieHeader2 = await getCookieHeader("user2");

    const res = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookieHeader2)
      .send({ title: "Buy milk", responsible: "Alice" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("required-description");
  });

  it("returns 400 when responsible is missing", async () => {
    const cookieHeader3 = await getCookieHeader("user3");

    const res = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookieHeader3)
      .send({ title: "Buy milk", description: "2 liters" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("required-responsible");
  });

  it("creates a todo when valid data is provided", async () => {
    const cookieHeader4 = await getCookieHeader("user4");

    const payload = {
      title: "Buy milk",
      description: "2 liters",
      responsible: "Alice",
    };
    const res = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookieHeader4)
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(payload.title);
    expect(res.body.description).toBe(payload.description);
    expect(res.body.responsible).toBe(payload.responsible);
  });
});
