const request = require("supertest");
const app = require("../src/app");
const users = require("../src/data/users.json");

describe("GET /api/profile/:userId", () => {
  it("should return 200 and profile data for a valid user", async () => {
    const res = await request(app).get("/api/profile/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      name: users[0].name,
      email: users[0].email,
      avatarUrl: users[0].avatarUrl,
      joinDate: users[0].joinDate,
    });
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/profile/1");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return profile with correct shape", async () => {
    const res = await request(app).get("/api/profile/2");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("avatarUrl");
    expect(res.body).toHaveProperty("joinDate");
  });

  it("should not include the user id in the response", async () => {
    const res = await request(app).get("/api/profile/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).not.toHaveProperty("id");
  });

  it("should return 404 for a non-existent user id", async () => {
    const res = await request(app).get("/api/profile/999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return 404 for a non-numeric user id", async () => {
    const res = await request(app).get("/api/profile/abc");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return 404 for a negative user id", async () => {
    const res = await request(app).get("/api/profile/-1");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return 404 for a decimal user id", async () => {
    const res = await request(app).get("/api/profile/1.5");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("should return correct data for each user", async () => {
    for (const user of users) {
      const res = await request(app).get(`/api/profile/${user.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
    }
  });
});
