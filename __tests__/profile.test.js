const request = require("supertest");
const app = require("../src/app");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return 200 and the user profile for a valid userId", async () => {
    const res = await request(app).get(`/api/profile/${users[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(users[0]);
  });

  it("should return 404 for a non-existent userId", async () => {
    const res = await request(app).get("/api/profile/non-existent-id");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return the correct response shape", async () => {
    const res = await request(app).get(`/api/profile/${users[0].id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("avatarUrl");
    expect(res.body).toHaveProperty("joinedAt");
  });
});
