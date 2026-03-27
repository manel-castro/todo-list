import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../../../app.js";

// allow more time for mongodb-memory-server to download/start
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

describe("POST /api/todos/add", () => {
  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/todos/add")
      .send({ description: "x", responsible: "y" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("required-title");
  });

  it("returns 400 when description is missing", async () => {
    const res = await request(app)
      .post("/api/todos/add")
      .send({ title: "Buy milk", responsible: "Alice" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("required-description");
  });

  it("returns 400 when responsible is missing", async () => {
    const res = await request(app)
      .post("/api/todos/add")
      .send({ title: "Buy milk", description: "2 liters" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("required-responsible");
  });

  it("creates a todo when valid data is provided", async () => {
    const payload = {
      title: "Buy milk",
      description: "2 liters",
      responsible: "Alice",
    };
    const res = await request(app)
      .post("/api/todos/add")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(payload.title);
    expect(res.body.description).toBe(payload.description);
    expect(res.body.responsible).toBe(payload.responsible);
  });
});
