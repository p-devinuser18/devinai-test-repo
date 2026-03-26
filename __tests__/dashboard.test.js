const request = require("supertest");
const app = require("../src/app");
const products = require("../src/data/products.json");

describe("GET /api/dashboard", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.statusCode).toBe(200);
  });

  it("should return totalProducts matching products.json count", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.body.totalProducts).toBe(products.length);
  });

  it("should return productsByCategory with correct counts", async () => {
    const res = await request(app).get("/api/dashboard");
    const expectedCounts = {};
    products.forEach((product) => {
      expectedCounts[product.category] =
        (expectedCounts[product.category] || 0) + 1;
    });
    expect(res.body.productsByCategory).toEqual(expectedCounts);
  });

  it("should return timestamp in ISO format", async () => {
    const res = await request(app).get("/api/dashboard");
    const timestamp = res.body.timestamp;
    expect(typeof timestamp).toBe("string");
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });

  it("should match expected response shape", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.body).toHaveProperty("totalProducts");
    expect(res.body).toHaveProperty("productsByCategory");
    expect(res.body).toHaveProperty("timestamp");
    expect(typeof res.body.totalProducts).toBe("number");
    expect(typeof res.body.productsByCategory).toBe("object");
    expect(typeof res.body.timestamp).toBe("string");
  });
});
