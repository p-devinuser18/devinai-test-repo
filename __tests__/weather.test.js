const request = require("supertest");
const app = require("../src/app");

const mockWeatherResponse = {
  name: "London",
  main: { temp: 15.5, humidity: 72 },
  weather: [{ description: "scattered clouds" }],
};

beforeEach(() => {
  process.env.WEATHER_API_KEY = "test-api-key";
  jest.restoreAllMocks();
});

describe("GET /api/weather/:city", () => {
  it("should return weather data for a valid city", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockWeatherResponse,
    });

    const res = await request(app)
      .get("/api/weather/London")
      .set("Authorization", "Bearer test-token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      city: "London",
      temperature: 15.5,
      description: "scattered clouds",
      humidity: 72,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=London"),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("should return 404 when city is not found", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: "city not found" }),
    });

    const res = await request(app)
      .get("/api/weather/NonExistentCity")
      .set("Authorization", "Bearer test-token");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "City not found" });
  });

  it("should return 502 when the weather API returns a server error", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "internal error" }),
    });

    const res = await request(app)
      .get("/api/weather/London")
      .set("Authorization", "Bearer test-token");

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should return 502 when the request times out", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    });

    const res = await request(app)
      .get("/api/weather/London")
      .set("Authorization", "Bearer test-token");

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should return 502 when fetch throws a network error", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));

    const res = await request(app)
      .get("/api/weather/London")
      .set("Authorization", "Bearer test-token");

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "Weather service unavailable" });
  });

  it("should use WEATHER_API_KEY from environment", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockWeatherResponse,
    });

    await request(app)
      .get("/api/weather/London")
      .set("Authorization", "Bearer test-token");

    const calledUrl = global.fetch.mock.calls[0][0];
    const params = new URLSearchParams(calledUrl.split("?")[1]);
    expect(params.get("appid")).toBe("test-api-key");
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/weather/London");
    expect(res.statusCode).toBe(401);
  });
});
