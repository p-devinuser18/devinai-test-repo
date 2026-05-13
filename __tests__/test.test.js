const request = require("supertest");
const app = require("../src/app");

const validPayload = {
  transactionId: "TXN-001",
  date: "2026-05-13",
  customerNumber: "CUST-12345",
  jwttoken: "valid.jwt.token",
};

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("POST /v1/test", () => {
  it("should return 401 when authorization header is missing", async () => {
    const res = await request(app).post("/v1/test").send(validPayload);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Authorization token required" });
  });

  it("should return 400 when transactionId is missing", async () => {
    const { transactionId, ...payload } = validPayload;

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
    expect(res.body.error).toMatch(/Missing required fields/);
  });

  it("should return 400 when date is missing", async () => {
    const { date, ...payload } = validPayload;

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
  });

  it("should return 400 when customerNumber is missing", async () => {
    const { customerNumber, ...payload } = validPayload;

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
  });

  it("should return 400 when jwttoken is missing", async () => {
    const { jwttoken, ...payload } = validPayload;

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
  });

  it("should return 400 when body is empty", async () => {
    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
  });

  it("should return success when JWT validation succeeds", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ valid: true }),
    });

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      transactionId: "TXN-001",
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://internal/v1/jwt/token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer valid.jwt.token",
        }),
        body: JSON.stringify({
          transactionId: "TXN-001",
          date: "2026-05-13",
          customerNumber: "CUST-12345",
        }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("should return failure when JWT is invalid (valid:false)", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ valid: false }),
    });

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "failure",
      transactionId: "TXN-001",
    });
  });

  it("should return failure when JWT service returns 401", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
    });

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "failure",
      error: "JWT validation failed",
    });
  });

  it("should return failure when JWT service returns 403", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
    });

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "failure",
      error: "JWT validation failed",
    });
  });

  it("should return 502 when JWT service returns 500", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    });

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({
      status: "failure",
      error: "JWT service unavailable",
    });
  });

  it("should return 502 when the JWT service times out", async () => {
    const timeoutError = new DOMException(
      "The operation was aborted.",
      "TimeoutError",
    );
    jest.spyOn(global, "fetch").mockRejectedValue(timeoutError);

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({
      status: "failure",
      error: "JWT service timeout",
    });
  });

  it("should return 502 when fetch throws a network error", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(validPayload);

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({
      status: "failure",
      error: "JWT service unavailable",
    });
  });

  it("should return 400 when transactionId is an empty string", async () => {
    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send({ ...validPayload, transactionId: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
  });

  it("should return 400 when jwttoken is an empty string", async () => {
    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send({ ...validPayload, jwttoken: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failure");
  });

  it("should forward transactionId in the response on success", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ valid: true }),
    });

    const customPayload = { ...validPayload, transactionId: "TXN-UNIQUE-999" };

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send(customPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.transactionId).toBe("TXN-UNIQUE-999");
  });

  it("should send the jwttoken as Bearer in Authorization header to internal API", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ valid: true }),
    });

    const res = await request(app)
      .post("/v1/test")
      .set("Authorization", "Bearer token")
      .send({ ...validPayload, jwttoken: "my-special-token" });

    expect(res.statusCode).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://internal/v1/jwt/token",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-special-token",
        }),
      }),
    );
  });
});
