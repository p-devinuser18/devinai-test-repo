const request = require("supertest");
const app = require("../src/app");
const { resetMetrics } = require("../src/middleware/metrics");

const AUTH_HEADER = { Authorization: "Bearer test-token" };

describe("GET /metrics", () => {
  beforeEach(() => {
    resetMetrics();
  });

  it("should return 200 with metrics object", async () => {
    const res = await request(app).get("/metrics");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalRequests");
    expect(res.body).toHaveProperty("successCount");
    expect(res.body).toHaveProperty("failureCount");
    expect(res.body).toHaveProperty("byStatusCode");
  });

  it("should return JSON content type", async () => {
    const res = await request(app).get("/metrics");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("should start with zero counts after reset", async () => {
    const res = await request(app).get("/metrics");
    expect(res.body.totalRequests).toBe(0);
    expect(res.body.successCount).toBe(0);
    expect(res.body.failureCount).toBe(0);
  });

  it("should count successful requests", async () => {
    await request(app).get("/health");
    await request(app).get("/health");

    const res = await request(app).get("/metrics");
    expect(res.body.totalRequests).toBeGreaterThanOrEqual(2);
    expect(res.body.successCount).toBeGreaterThanOrEqual(2);
    expect(res.body.byStatusCode["200"]).toBeGreaterThanOrEqual(2);
  });

  it("should count failed requests (401 unauthorized)", async () => {
    await request(app).get("/api/products");

    const res = await request(app).get("/metrics");
    expect(res.body.failureCount).toBeGreaterThanOrEqual(1);
    expect(res.body.byStatusCode["401"]).toBeGreaterThanOrEqual(1);
  });

  it("should track both success and failure counts", async () => {
    await request(app).get("/health");
    await request(app).get("/api/products");

    const res = await request(app).get("/metrics");
    expect(res.body.successCount).toBeGreaterThanOrEqual(1);
    expect(res.body.failureCount).toBeGreaterThanOrEqual(1);
    expect(res.body.totalRequests).toBe(
      res.body.successCount + res.body.failureCount
    );
  });

  it("should not require authentication", async () => {
    const res = await request(app).get("/metrics");
    expect(res.statusCode).toBe(200);
  });
});
