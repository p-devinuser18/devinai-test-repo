const request = require("supertest");
const app = require("../src/app");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return 200 and the correct user for a valid userId", async () => {
    const user = users[0];
    const res = await request(app).get(`/api/profile/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.id).toBe(user.id);
    expect(res.body.name).toBe(user.name);
    expect(res.body.email).toBe(user.email);
  });

  it("should return 404 for a non-existent userId", async () => {
    const res = await request(app).get("/api/profile/nonexistent");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  it("should return the correct response shape with all required fields", async () => {
    const user = users[0];
    const res = await request(app).get(`/api/profile/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("avatarUrl");
    expect(res.body).toHaveProperty("joinedAt");
  });

  it("should return different users for different valid userIds", async () => {
    const res1 = await request(app).get(`/api/profile/${users[0].id}`);
    const res2 = await request(app).get(`/api/profile/${users[1].id}`);
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res1.body.id).not.toBe(res2.body.id);
    expect(res1.body.name).not.toBe(res2.body.name);
  });
});
