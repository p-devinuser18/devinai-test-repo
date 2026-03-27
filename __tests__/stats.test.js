const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");

const ordersPath = path.join(__dirname, "../src/data/orders.json");

describe("GET /api/stats", () => {
  const sampleOrders = [
    { id: 1, productId: 1, quantity: 2, status: "pending" },
    { id: 2, productId: 3, quantity: 1, status: "shipped" },
    { id: 3, productId: 2, quantity: 1, status: "delivered" },
    { id: 4, productId: 5, quantity: 3, status: "pending" },
    { id: 5, productId: 4, quantity: 1, status: "delivered" },
  ];

  afterEach(() => {
    // Clean up orders.json if we created it
    try {
      fs.unlinkSync(ordersPath);
    } catch {
      // ignore if it doesn't exist
    }
  });

  it("should return correct totalProducts count", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.totalProducts).toBe(6);
  });

  it("should return correct categoryCounts", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.categoryCounts).toEqual({
      electronics: 2,
      books: 2,
      clothing: 2,
    });
  });

  it("should return correct response shape", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalProducts");
    expect(res.body).toHaveProperty("totalOrders");
    expect(res.body).toHaveProperty("categoryCounts");
    expect(res.body).toHaveProperty("orderStatusCounts");
  });

  it("should return 0 totalOrders and empty orderStatusCounts when orders.json is missing", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.totalOrders).toBe(0);
    expect(res.body.orderStatusCounts).toEqual({});
  });

  it("should return correct order stats when orders.json exists", async () => {
    fs.writeFileSync(ordersPath, JSON.stringify(sampleOrders));

    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body.totalOrders).toBe(5);
    expect(res.body.orderStatusCounts).toEqual({
      pending: 2,
      shipped: 1,
      delivered: 2,
    });
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
