const request = require("supertest");
const app = require("../src/app");
const orders = require("../src/data/orders.json");

describe("GET /api/orders", () => {
  it("should return all orders when no filters are provided", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(orders);
    expect(res.body.length).toBe(5);
  });

  it("should return JSON content type", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("should return orders with correct shape", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    res.body.forEach((order) => {
      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("productId");
      expect(order).toHaveProperty("quantity");
      expect(order).toHaveProperty("totalPrice");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("createdAt");
    });
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.statusCode).toBe(401);
  });

  // Status filtering
  it("should filter orders by status=pending", async () => {
    const res = await request(app)
      .get("/api/orders?status=pending")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((order) => {
      expect(order.status).toBe("pending");
    });
  });

  it("should filter orders by status=shipped", async () => {
    const res = await request(app)
      .get("/api/orders?status=shipped")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((order) => {
      expect(order.status).toBe("shipped");
    });
  });

  it("should filter orders by status=delivered", async () => {
    const res = await request(app)
      .get("/api/orders?status=delivered")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    res.body.forEach((order) => {
      expect(order.status).toBe("delivered");
    });
  });

  it("should filter orders by status case-insensitively", async () => {
    const res = await request(app)
      .get("/api/orders?status=PENDING")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((order) => {
      expect(order.status).toBe("pending");
    });
  });

  it("should return empty array for non-existent status", async () => {
    const res = await request(app)
      .get("/api/orders?status=cancelled")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // Pagination
  it("should return default page with limit=10", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(5);
  });

  it("should paginate with page=1&limit=2", async () => {
    const res = await request(app)
      .get("/api/orders?page=1&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1);
    expect(res.body[1].id).toBe(2);
  });

  it("should paginate with page=2&limit=2", async () => {
    const res = await request(app)
      .get("/api/orders?page=2&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(3);
    expect(res.body[1].id).toBe(4);
  });

  it("should return remaining items on last page", async () => {
    const res = await request(app)
      .get("/api/orders?page=3&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(5);
  });

  it("should return empty array when page exceeds total pages", async () => {
    const res = await request(app)
      .get("/api/orders?page=10&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should default to page=1 when page is not provided", async () => {
    const res = await request(app)
      .get("/api/orders?limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1);
  });

  it("should handle page=0 by defaulting to page 1", async () => {
    const res = await request(app)
      .get("/api/orders?page=0&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1);
  });

  it("should handle negative page by defaulting to page 1", async () => {
    const res = await request(app)
      .get("/api/orders?page=-1&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1);
  });

  it("should handle non-numeric page gracefully", async () => {
    const res = await request(app)
      .get("/api/orders?page=abc&limit=2")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1);
  });

  it("should handle non-numeric limit gracefully", async () => {
    const res = await request(app)
      .get("/api/orders?limit=abc")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(5);
  });

  // Pagination combined with status filtering
  it("should paginate filtered results", async () => {
    const res = await request(app)
      .get("/api/orders?status=pending&page=1&limit=1")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("pending");
  });

  it("should return page 2 of filtered results", async () => {
    const res = await request(app)
      .get("/api/orders?status=pending&page=2&limit=1")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("pending");
  });

  it("should return empty when page exceeds filtered results", async () => {
    const res = await request(app)
      .get("/api/orders?status=pending&page=5&limit=1")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/orders/:id", () => {
  it("should return a single order by id", async () => {
    const res = await request(app)
      .get("/api/orders/1")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(orders[0]);
  });

  it("should return 404 for non-existent order", async () => {
    const res = await request(app)
      .get("/api/orders/999")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Order not found" });
  });

  it("should return 404 for non-numeric id", async () => {
    const res = await request(app)
      .get("/api/orders/abc")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Order not found" });
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/orders/1");
    expect(res.statusCode).toBe(401);
  });

  it("should return order with correct shape", async () => {
    const res = await request(app)
      .get("/api/orders/3")
      .set("Authorization", "Bearer test-token");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("productId");
    expect(res.body).toHaveProperty("quantity");
    expect(res.body).toHaveProperty("totalPrice");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("createdAt");
  });
});
