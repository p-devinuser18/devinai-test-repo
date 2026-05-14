const request = require("supertest");
const app = require("../src/app");

describe("GET /user", () => {
  it("should return 200 status code", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return an empty users array", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", "Bearer test-token");
    expect(res.body).toEqual({ users: [] });
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/user");
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /user/:id", () => {
  it("should return 200 status code", async () => {
    const res = await request(app)
      .get("/user/1")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/user/1")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return a user with the correct id", async () => {
    const res = await request(app)
      .get("/user/1")
      .set("Authorization", "Bearer test-token");
    expect(res.body).toEqual({ id: "1", name: "Sample User" });
  });

  it("should return the correct id for different ids", async () => {
    const res = await request(app)
      .get("/user/42")
      .set("Authorization", "Bearer test-token");
    expect(res.body).toEqual({ id: "42", name: "Sample User" });
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/user/1");
    expect(res.statusCode).toBe(401);
  });
});
