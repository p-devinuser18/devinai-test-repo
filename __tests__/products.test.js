const request = require('supertest');
const app = require('../src/app');

describe('GET /api/products', () => {
  it('should return all products when no category filter is provided', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter products by exact-case category', async () => {
    const res = await request(app).get('/api/products?category=Electronics');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category).toBe('Electronics');
    });
  });

  it('should filter products case-insensitively (lowercase)', async () => {
    const res = await request(app).get('/api/products?category=electronics');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('electronics');
    });
  });

  it('should filter products case-insensitively (uppercase)', async () => {
    const res = await request(app).get('/api/products?category=KITCHEN');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('kitchen');
    });
  });

  it('should filter products case-insensitively (mixed case)', async () => {
    const res = await request(app).get('/api/products?category=sPoRtS');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('sports');
    });
  });

  it('should return same results regardless of category case', async () => {
    const [exact, lower, upper] = await Promise.all([
      request(app).get('/api/products?category=Electronics'),
      request(app).get('/api/products?category=electronics'),
      request(app).get('/api/products?category=ELECTRONICS'),
    ]);
    expect(exact.body).toEqual(lower.body);
    expect(exact.body).toEqual(upper.body);
  });

  it('should return empty array for non-existent category', async () => {
    const res = await request(app).get('/api/products?category=NonExistent');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
