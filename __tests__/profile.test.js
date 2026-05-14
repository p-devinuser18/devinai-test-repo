const request = require("supertest");
const app = require("../src/app");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return a user profile for a valid userId", async () => {
    const res = await request(app)
      .get(`/api/profile/${users[0].id}`)
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(users[0]);
  });

  it("should return 404 for a non-existent userId", async () => {
    const res = await request(app)
      .get("/api/profile/non-existent-id")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return a response with the correct shape", async () => {
    const res = await request(app)
      .get(`/api/profile/${users[0].id}`)
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("avatarUrl");
    expect(res.body).toHaveProperty("joinedAt");
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get(`/api/profile/${users[0].id}`)
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should require authentication", async () => {
    const res = await request(app).get(`/api/profile/${users[0].id}`);
    expect(res.statusCode).toBe(401);
  });
});
