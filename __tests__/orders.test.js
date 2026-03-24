const request = require('supertest');
const app = require('../src/app');
const orders = require('../src/data/orders.json');

describe('GET /api/orders', () => {
  it('should return 200 status code', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
  });

  it('should return JSON content type', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return an array of orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(5);
  });

  it('should return orders with correct shape', async () => {
    const res = await request(app).get('/api/orders');
    const order = res.body[0];
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('productId');
    expect(order).toHaveProperty('quantity');
    expect(order).toHaveProperty('totalPrice');
    expect(order).toHaveProperty('status');
    expect(order).toHaveProperty('createdAt');
  });

  describe('pagination', () => {
    it('should return all orders with default pagination', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.body.length).toBe(5);
    });

    it('should limit results with limit param', async () => {
      const res = await request(app).get('/api/orders?limit=2');
      expect(res.body.length).toBe(2);
      expect(res.body[0].id).toBe(1);
      expect(res.body[1].id).toBe(2);
    });

    it('should return correct page with page param', async () => {
      const res = await request(app).get('/api/orders?page=2&limit=2');
      expect(res.body.length).toBe(2);
      expect(res.body[0].id).toBe(3);
      expect(res.body[1].id).toBe(4);
    });

    it('should return last partial page correctly', async () => {
      const res = await request(app).get('/api/orders?page=3&limit=2');
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(5);
    });

    it('should return empty array for page beyond data', async () => {
      const res = await request(app).get('/api/orders?page=100&limit=10');
      expect(res.body).toEqual([]);
    });

    it('should default to page 1 if page is invalid', async () => {
      const res = await request(app).get('/api/orders?page=abc&limit=2');
      expect(res.body.length).toBe(2);
      expect(res.body[0].id).toBe(1);
    });

    it('should default to limit 10 if limit is invalid', async () => {
      const res = await request(app).get('/api/orders?limit=abc');
      expect(res.body.length).toBe(5);
    });

    it('should return single item with limit=1', async () => {
      const res = await request(app).get('/api/orders?limit=1');
      expect(res.body.length).toBe(1);
    });
  });

  describe('status filtering', () => {
    it('should filter orders by status=pending', async () => {
      const res = await request(app).get('/api/orders?status=pending');
      expect(res.body.length).toBe(2);
      res.body.forEach((order) => {
        expect(order.status).toBe('pending');
      });
    });

    it('should filter orders by status=shipped', async () => {
      const res = await request(app).get('/api/orders?status=shipped');
      expect(res.body.length).toBe(2);
      res.body.forEach((order) => {
        expect(order.status).toBe('shipped');
      });
    });

    it('should filter orders by status=delivered', async () => {
      const res = await request(app).get('/api/orders?status=delivered');
      expect(res.body.length).toBe(1);
      res.body.forEach((order) => {
        expect(order.status).toBe('delivered');
      });
    });

    it('should return empty array for unknown status', async () => {
      const res = await request(app).get('/api/orders?status=cancelled');
      expect(res.body).toEqual([]);
    });

    it('should combine status filter with pagination', async () => {
      const res = await request(app).get('/api/orders?status=pending&limit=1');
      expect(res.body.length).toBe(1);
      expect(res.body[0].status).toBe('pending');
    });
  });
});

describe('GET /api/orders/:id', () => {
  it('should return a single order by id', async () => {
    const res = await request(app).get('/api/orders/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body).toHaveProperty('productId');
    expect(res.body).toHaveProperty('quantity');
    expect(res.body).toHaveProperty('totalPrice');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('createdAt');
  });

  it('should return 404 for non-existent order', async () => {
    const res = await request(app).get('/api/orders/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Order not found');
  });

  it('should return 404 for invalid id', async () => {
    const res = await request(app).get('/api/orders/abc');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Order not found');
  });

  it('should return correct order for each id', async () => {
    for (const order of orders) {
      const res = await request(app).get(`/api/orders/${order.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(order.id);
      expect(res.body.totalPrice).toBe(order.totalPrice);
    }
  });
});
