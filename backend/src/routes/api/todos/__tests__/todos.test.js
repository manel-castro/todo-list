import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../../app.js";

// ensure env vars required by app are set before importing
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/test";
process.env.PORT = process.env.PORT || "3000";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.ACCESS_TOKEN_EXPIRATION_SECONDS =
  process.env.ACCESS_TOKEN_EXPIRATION_SECONDS || "3600";

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
    expect(res.body.errors[0].message).toBe("Title is required.");
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
    expect(res.body.errors[0].message).toBe("Description is required.");
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
    expect(res.body.errors[0].message).toBe("Responsible is required.");
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

describe("GET /api/todos/list", () => {
  it("creates a todo then lists it for the authenticated user", async () => {
    const cookies = await getCookieHeader("listUser");

    const payload = {
      title: "Read book",
      description: "Read chapter 1",
      responsible: "Bob",
    };

    const createTodo = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookies)
      .send(payload)
      .set("Accept", "application/json");

    expect(createTodo.status).toBe(201);
    const created = createTodo.body;
    expect(created).toHaveProperty("id");

    const listRes = await request(app)
      .get("/api/todos/list")
      .set("Cookie", cookies);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);

    const foundTodo = listRes.body.find((t) => t.id === created.id);
    expect(foundTodo).toBeDefined();
    expect(foundTodo.title).toBe(payload.title);
    expect(foundTodo.description).toBe(payload.description);
    expect(foundTodo.responsible).toBe(payload.responsible);
  });
});

describe("PUT /api/todos/update", () => {
  it("creates a todo then updates it", async () => {
    const cookies = await getCookieHeader("updateUser");

    const payload = {
      title: "Do laundry",
      description: "Wash whites",
      responsible: "Alice",
    };

    const createRes = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookies)
      .send(payload)
      .set("Accept", "application/json");

    expect(createRes.status).toBe(201);
    const created = createRes.body;

    const updatePayload = {
      id: created.id,
      title: "Do laundry updated",
      description: "Wash colors",
    };

    const updateRes = await request(app)
      .put("/api/todos/update")
      .set("Cookie", cookies)
      .send(updatePayload)
      .set("Accept", "application/json");

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty("id", created.id);
    expect(updateRes.body.title).toBe(updatePayload.title);
    expect(updateRes.body.description).toBe(updatePayload.description);
    // unchanged field remains
    expect(updateRes.body.responsible).toBe(payload.responsible);
  });

  it("creates a todo then marks it completed", async () => {
    const cookies = await getCookieHeader("completeUser");

    const payload = {
      title: "Write tests",
      description: "Add completed flag test",
      responsible: "Sam",
    };

    const createRes = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookies)
      .send(payload)
      .set("Accept", "application/json");

    expect(createRes.status).toBe(201);
    const created = createRes.body;
    expect(created).toHaveProperty("id");
    // default should be false
    expect(created.completed).toBe(false);

    const updatePayload = {
      id: created.id,
      completed: true,
    };

    const completedTodoRes = await request(app)
      .put("/api/todos/update")
      .set("Cookie", cookies)
      .send(updatePayload)
      .set("Accept", "application/json");

    expect(completedTodoRes.status).toBe(200);
    expect(completedTodoRes.body).toHaveProperty("id", created.id);
    expect(completedTodoRes.body.completed).toBe(true);
  });
});

describe("DELETE /api/todos/delete", () => {
  it("creates a todo then deletes it", async () => {
    const cookies = await getCookieHeader("deleteUser");

    const payload = {
      title: "Temp task",
      description: "To be deleted",
      responsible: "Eve",
    };

    const createRes = await request(app)
      .post("/api/todos/add")
      .set("Cookie", cookies)
      .send(payload)
      .set("Accept", "application/json");

    expect(createRes.status).toBe(201);
    const created = createRes.body;

    const deleteRes = await request(app)
      .delete("/api/todos/delete")
      .set("Cookie", cookies)
      .send({ id: created.id })
      .set("Accept", "application/json");

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty("id", created.id);

    const listRes = await request(app)
      .get("/api/todos/list")
      .set("Cookie", cookies);
    expect(listRes.status).toBe(200);
    const found = listRes.body.find((t) => t.id === created.id);
    expect(found).toBeUndefined();
  });

  it("returns 400 when todo not found", async () => {
    const cookies = await getCookieHeader("deleteUser2");

    const res = await request(app)
      .delete("/api/todos/delete")
      .set("Cookie", cookies)
      .send({ id: "507f1f77bcf86cd799439013" })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("Todo not found.");
  });

  it("returns 400 when id is missing", async () => {
    const cookies = await getCookieHeader("deleteUser3");

    const res = await request(app)
      .delete("/api/todos/delete")
      .set("Cookie", cookies)
      .send({})
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].message).toBe("Todo ID is required.");
  });
});
