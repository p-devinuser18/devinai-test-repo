const request = require("supertest");
const app = require("../src/app");
const products = require("../src/data/products.json");

describe("GET /api/products", () => {
  it("should return all products when no category filter is provided", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(products);
    expect(res.body.length).toBe(6);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should filter products by category", async () => {
    const res = await request(app)
      .get("/api/products?category=electronics")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter products by category case-insensitively (all caps)", async () => {
    const res = await request(app)
      .get("/api/products?category=ELECTRONICS")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter products by category case-insensitively (mixed case)", async () => {
    const res = await request(app)
      .get("/api/products?category=Books")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("books");
    });
  });

  it("should return empty array for non-existent category", async () => {
    const res = await request(app)
      .get("/api/products?category=toys")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return empty array for invalid category", async () => {
    const res = await request(app)
      .get("/api/products?category=xyz123")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(401);
  });

  it("should respond within 500ms", async () => {
    const start = Date.now();
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer test-token");
    const elapsed = Date.now() - start;
    expect(res.statusCode).toBe(200);
    expect(elapsed).toBeLessThan(500);
  });

  it("should return a valid JSON array", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return application/json content-type", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("should return products with correct shape", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    res.body.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("inStock");
    });
  });
});
