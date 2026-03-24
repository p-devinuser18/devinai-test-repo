const request = require("supertest");
const app = require("../src/app");

describe("GET /products", () => {
  it("should return 401 without auth token", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 with auth token", async () => {
    const res = await request(app)
      .get("/products")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/products")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return an empty products array", async () => {
    const res = await request(app)
      .get("/products")
      .set("Authorization", "Bearer test-token");
    expect(res.body.products).toEqual([]);
  });
});

describe("GET /products/:id", () => {
  it("should return 401 without auth token", async () => {
    const res = await request(app).get("/products/1");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 with auth token", async () => {
    const res = await request(app)
      .get("/products/1")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
  });

  it("should return the product with the given id", async () => {
    const res = await request(app)
      .get("/products/42")
      .set("Authorization", "Bearer test-token");
    expect(res.body.id).toBe("42");
    expect(res.body.name).toBe("Sample Product");
  });
});
