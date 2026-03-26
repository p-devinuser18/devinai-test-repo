const request = require("supertest");
const app = require("../src/app");
const products = require("../src/data/products.json");

describe("GET /api/stats", () => {
  it("should require authentication", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 status code with auth", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return totalProducts matching products data", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    expect(res.body.totalProducts).toBe(products.length);
  });

  it("should return categories as an array", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });

  it("should return unique categories", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    const uniqueCategories = [...new Set(res.body.categories)];
    expect(res.body.categories).toEqual(uniqueCategories);
  });

  it("should return correct inStockCount and outOfStockCount", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    const expectedInStock = products.filter((p) => p.inStock).length;
    const expectedOutOfStock = products.length - expectedInStock;
    expect(res.body.inStockCount).toBe(expectedInStock);
    expect(res.body.outOfStockCount).toBe(expectedOutOfStock);
  });

  it("should return averagePrice as a number", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    expect(typeof res.body.averagePrice).toBe("number");
    expect(res.body.averagePrice).toBeGreaterThan(0);
  });

  it("should return response with correct shape", async () => {
    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", "Bearer test-token");
    expect(res.body).toHaveProperty("totalProducts");
    expect(res.body).toHaveProperty("categories");
    expect(res.body).toHaveProperty("inStockCount");
    expect(res.body).toHaveProperty("outOfStockCount");
    expect(res.body).toHaveProperty("averagePrice");
  });
});
