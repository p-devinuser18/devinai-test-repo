const request = require("supertest");
const app = require("../src/app");

describe("GET /api/categories", () => {
  it("should return unique categories sorted alphabetically", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(["books", "clothing", "electronics"]);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return an array", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should not contain duplicates", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer test-token");
    const unique = [...new Set(res.body)];
    expect(res.body).toEqual(unique);
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(401);
  });
});
