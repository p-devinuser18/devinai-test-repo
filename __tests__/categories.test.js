const request = require("supertest");
const app = require("../src/app");

describe("GET /api/categories", () => {
  it("should return 200 status code", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return an array of unique category strings", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((category) => {
      expect(typeof category).toBe("string");
    });
    // No duplicates
    const unique = [...new Set(res.body)];
    expect(res.body.length).toBe(unique.length);
  });

  it("should return categories sorted alphabetically", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    const sorted = [...res.body].sort();
    expect(res.body).toEqual(sorted);
  });

  it("should return the expected categories from products.json", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(res.body).toEqual(["books", "clothing", "electronics"]);
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(401);
  });
});
