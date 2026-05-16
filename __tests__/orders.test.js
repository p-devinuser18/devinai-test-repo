const request = require("supertest");
const app = require("../src/app");
const orders = require("../src/data/orders.json");

describe("GET /api/orders", () => {
  it("should return all orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(orders);
    expect(res.body.length).toBe(5);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.statusCode).toBe(401);
  });

  it("should return orders with correct shape", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    res.body.forEach((order) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("productId");
      expect(order).toHaveProperty("quantity");
      expect(order).toHaveProperty("totalPrice");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("createdAt");
    });
  });

  it("should only contain valid status values", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    const validStatuses = ["pending", "shipped", "delivered"];
    res.body.forEach((order) => {
      expect(validStatuses).toContain(order.status);
    });
  });
});
