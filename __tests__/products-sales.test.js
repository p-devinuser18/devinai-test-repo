const request = require("supertest");
const app = require("../src/app");
const salesProducts = require("../src/data/sales-products.json");

const AUTH_HEADER = { Authorization: "Bearer test-token" };
const VALID_COUNTRY = { customerCountry: "India" };

describe("GET /api/products/sales", () => {
  it("should return all products when no category filter is provided", async () => {
    const res = await request(app)
      .get("/api/products/sales")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(salesProducts);
    expect(res.body.length).toBe(6);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/products/sales")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should filter products by category", async () => {
    const res = await request(app)
      .get("/api/products/sales?category=electronics")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should filter products by category case-insensitively", async () => {
    const res = await request(app)
      .get("/api/products/sales?category=ELECTRONICS")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((product) => {
      expect(product.category).toBe("electronics");
    });
  });

  it("should return empty array for non-existent category", async () => {
    const res = await request(app)
      .get("/api/products/sales?category=toys")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return empty array for invalid category", async () => {
    const res = await request(app)
      .get("/api/products/sales?category=xyz123")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 400 when customerCountry header is missing", async () => {
    const res = await request(app).get("/api/products/sales").set(AUTH_HEADER);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid request" });
  });

  it("should return 400 when customerCountry is not India", async () => {
    const res = await request(app)
      .get("/api/products/sales")
      .set(AUTH_HEADER)
      .set({ customerCountry: "USA" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid request" });
  });

  it("should accept customerCountry header case-insensitively", async () => {
    const res = await request(app)
      .get("/api/products/sales")
      .set(AUTH_HEADER)
      .set({ customerCountry: "india" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(salesProducts);
  });

  it("should require authentication", async () => {
    const res = await request(app)
      .get("/api/products/sales")
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(401);
  });

  it("should return products with correct shape including count", async () => {
    const res = await request(app)
      .get("/api/products/sales")
      .set(AUTH_HEADER)
      .set(VALID_COUNTRY);
    expect(res.statusCode).toBe(200);
    res.body.forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("inStock");
      expect(product).toHaveProperty("count");
    });
  });
});
