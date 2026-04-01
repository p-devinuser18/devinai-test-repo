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
  });

  it('should return 5 orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.body).toHaveLength(5);
  });

  it('should return orders with correct properties', async () => {
    const res = await request(app).get('/api/orders');
    res.body.forEach((order) => {
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('productId');
      expect(order).toHaveProperty('quantity');
      expect(order).toHaveProperty('totalPrice');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('createdAt');
    });
  });

  it('should return orders with valid status values', async () => {
    const validStatuses = ['pending', 'shipped', 'delivered'];
    const res = await request(app).get('/api/orders');
    res.body.forEach((order) => {
      expect(validStatuses).toContain(order.status);
    });
  });

  it('should return data matching orders.json', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.body).toEqual(orders);
  });
});
