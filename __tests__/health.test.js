const request = require("supertest");
const app = require("../src/app");
const { version } = require("../package.json");

describe("GET /health", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it('should return status "ok"', async () => {
    const res = await request(app).get("/health");
    expect(res.body.status).toBe("ok");
  });

  it("should return uptime as a number", async () => {
    const res = await request(app).get("/health");
    expect(typeof res.body.uptime).toBe("number");
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it("should return version matching package.json", async () => {
    const res = await request(app).get("/health");
    expect(res.body.version).toBe(version);
  });

  it("should not require authentication", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("should increase uptime over time", async () => {
    const res1 = await request(app).get("/health");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const res2 = await request(app).get("/health");
    expect(res2.body.uptime).toBeGreaterThanOrEqual(res1.body.uptime);
  });
});
