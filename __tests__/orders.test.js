const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");

const DATA_PATH = path.join(__dirname, "../src/data/orders.json");
const AUTH_HEADER = { Authorization: "Bearer test-token" };

let originalData;

beforeAll(() => {
  originalData = fs.readFileSync(DATA_PATH, "utf-8");
});

afterEach(() => {
  fs.writeFileSync(DATA_PATH, originalData);
});

describe("GET /api/orders", () => {
  it("should return all orders", async () => {
    const res = await request(app).get("/api/orders").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(5);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/orders").set(AUTH_HEADER);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should filter orders by status", async () => {
    const res = await request(app)
      .get("/api/orders?status=pending")
      .set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((order) => {
      expect(order.status).toBe("pending");
    });
  });

  it("should filter orders by status case-insensitively", async () => {
    const res = await request(app)
      .get("/api/orders?status=SHIPPED")
      .set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("shipped");
  });

  it("should return empty array for non-existent status", async () => {
    const res = await request(app)
      .get("/api/orders?status=unknown")
      .set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.statusCode).toBe(401);
  });

  it("should return orders with correct shape", async () => {
    const res = await request(app).get("/api/orders").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    res.body.forEach((order) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("productId");
      expect(order).toHaveProperty("quantity");
      expect(order).toHaveProperty("customerName");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("total");
      expect(order).toHaveProperty("createdAt");
    });
  });
});

describe("GET /api/orders/:id", () => {
  it("should return a single order by id", async () => {
    const res = await request(app).get("/api/orders/1").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.customerName).toBe("Alice Johnson");
  });

  it("should return 404 for non-existent order", async () => {
    const res = await request(app).get("/api/orders/999").set(AUTH_HEADER);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Order not found");
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/orders/1");
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /api/orders", () => {
  it("should create a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(AUTH_HEADER)
      .send({ productId: 1, quantity: 2, customerName: "Test User" });
    expect(res.statusCode).toBe(201);
    expect(res.body.productId).toBe(1);
    expect(res.body.quantity).toBe(2);
    expect(res.body.customerName).toBe("Test User");
    expect(res.body.status).toBe("pending");
    expect(res.body.total).toBe(159.98);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("should return 400 if productId is missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(AUTH_HEADER)
      .send({ quantity: 1, customerName: "Test User" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/productId/);
  });

  it("should return 400 if quantity is missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(AUTH_HEADER)
      .send({ productId: 1, customerName: "Test User" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/quantity/);
  });

  it("should return 400 if customerName is missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(AUTH_HEADER)
      .send({ productId: 1, quantity: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/customerName/);
  });

  it("should return 400 for invalid productId", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set(AUTH_HEADER)
      .send({ productId: 999, quantity: 1, customerName: "Test User" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid productId");
  });

  it("should require authentication", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ productId: 1, quantity: 1, customerName: "Test User" });
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /api/orders/:id/status", () => {
  it("should update order status", async () => {
    const res = await request(app)
      .put("/api/orders/2/status")
      .set(AUTH_HEADER)
      .send({ status: "shipped" });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.status).toBe("shipped");
  });

  it("should accept status case-insensitively", async () => {
    const res = await request(app)
      .put("/api/orders/2/status")
      .set(AUTH_HEADER)
      .send({ status: "DELIVERED" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("delivered");
  });

  it("should return 400 for invalid status", async () => {
    const res = await request(app)
      .put("/api/orders/2/status")
      .set(AUTH_HEADER)
      .send({ status: "invalid" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/status must be one of/);
  });

  it("should return 400 if status is missing", async () => {
    const res = await request(app)
      .put("/api/orders/2/status")
      .set(AUTH_HEADER)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 for non-existent order", async () => {
    const res = await request(app)
      .put("/api/orders/999/status")
      .set(AUTH_HEADER)
      .send({ status: "shipped" });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Order not found");
  });

  it("should require authentication", async () => {
    const res = await request(app)
      .put("/api/orders/2/status")
      .send({ status: "shipped" });
    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE /api/orders/:id", () => {
  it("should delete an order and return it", async () => {
    const res = await request(app).delete("/api/orders/5").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(5);

    const listRes = await request(app).get("/api/orders").set(AUTH_HEADER);
    expect(listRes.body.length).toBe(4);
    expect(listRes.body.find((o) => o.id === 5)).toBeUndefined();
  });

  it("should return 404 for non-existent order", async () => {
    const res = await request(app).delete("/api/orders/999").set(AUTH_HEADER);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Order not found");
  });

  it("should require authentication", async () => {
    const res = await request(app).delete("/api/orders/1");
    expect(res.statusCode).toBe(401);
  });
});
