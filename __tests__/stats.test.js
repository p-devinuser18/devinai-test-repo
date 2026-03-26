const request = require("supertest");
const path = require("path");
const fs = require("fs");

const ORDERS_PATH = path.join(__dirname, "../src/data/orders.json");

describe("GET /api/stats", () => {
  let app;

  beforeEach(() => {
    // Clear require cache so each test gets a fresh app/stats module
    jest.resetModules();
  });

  describe("with orders.json present", () => {
    beforeEach(() => {
      app = require("../src/app");
    });

    it("should return 200 status code", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.statusCode).toBe(200);
    });

    it("should return correct totalProducts count", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.body.totalProducts).toBe(6);
    });

    it("should return correct totalOrders count", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.body.totalOrders).toBe(5);
    });

    it("should return correct categoryCounts", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.body.categoryCounts).toEqual({
        electronics: 2,
        books: 2,
        clothing: 2,
      });
    });

    it("should return correct orderStatusCounts", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.body.orderStatusCounts).toEqual({
        pending: 2,
        shipped: 1,
        delivered: 2,
      });
    });

    it("should return correct response shape", async () => {
      const res = await request(app).get("/api/stats");
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

  describe("when orders.json is missing", () => {
    let ordersBackup;
    let ordersExisted;

    beforeEach(() => {
      ordersExisted = fs.existsSync(ORDERS_PATH);
      if (ordersExisted) {
        ordersBackup = fs.readFileSync(ORDERS_PATH);
        fs.unlinkSync(ORDERS_PATH);
      }
      app = require("../src/app");
    });

    afterEach(() => {
      if (ordersExisted) {
        fs.writeFileSync(ORDERS_PATH, ordersBackup);
      }
    });

    it("should return 0 for totalOrders when orders.json is missing", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body.totalOrders).toBe(0);
    });

    it("should return empty orderStatusCounts when orders.json is missing", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.body.orderStatusCounts).toEqual({});
    });

    it("should still return correct product data when orders.json is missing", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.body.totalProducts).toBe(6);
      expect(res.body.categoryCounts).toEqual({
        electronics: 2,
        books: 2,
        clothing: 2,
      });
    });
  });
});
