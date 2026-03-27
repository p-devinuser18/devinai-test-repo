const request = require("supertest");
const path = require("path");
const fs = require("fs");

let app;

beforeEach(() => {
  jest.resetModules();
});

describe("GET /api/stats", () => {
  describe("when orders.json does not exist", () => {
    beforeEach(() => {
      app = require("../src/app");
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

    it("should return 0 totalOrders when orders.json is missing", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body.totalOrders).toBe(0);
      expect(res.body.orderStatusCounts).toEqual({});
    });

    it("should return correct response shape", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("totalProducts");
      expect(res.body).toHaveProperty("totalOrders");
      expect(res.body).toHaveProperty("categoryCounts");
      expect(res.body).toHaveProperty("orderStatusCounts");
      expect(typeof res.body.totalProducts).toBe("number");
      expect(typeof res.body.totalOrders).toBe("number");
      expect(typeof res.body.categoryCounts).toBe("object");
      expect(typeof res.body.orderStatusCounts).toBe("object");
    });

    it("should return JSON content type", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("when orders.json exists", () => {
    const ordersPath = path.join(__dirname, "../src/data/orders.json");
    const mockOrders = [
      { id: 1, product: "Wireless Headphones", status: "pending" },
      { id: 2, product: "USB-C Charger", status: "shipped" },
      { id: 3, product: "Clean Code", status: "delivered" },
      { id: 4, product: "Cotton T-Shirt", status: "pending" },
      { id: 5, product: "Denim Jeans", status: "delivered" },
    ];

    beforeEach(() => {
      fs.writeFileSync(ordersPath, JSON.stringify(mockOrders));
      app = require("../src/app");
    });

    afterEach(() => {
      if (fs.existsSync(ordersPath)) {
        fs.unlinkSync(ordersPath);
      }
    });

    it("should return correct totalOrders", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body.totalOrders).toBe(5);
    });

    it("should return correct orderStatusCounts", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body.orderStatusCounts).toEqual({
        pending: 2,
        shipped: 1,
        delivered: 2,
      });
    });
  });
});
