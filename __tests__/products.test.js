const request = require('supertest');
const app = require('../src/app');
const products = require('../src/data/products.json');

describe('GET /api/products', () => {
  it('should return 200 status code', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });

  it('should return JSON content type', async () => {
    const res = await request(app).get('/api/products');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return all products when no category filter is provided', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body).toEqual(products);
    expect(res.body.length).toBeGreaterThanOrEqual(6);
  });

  it('should return each product with required fields', async () => {
    const res = await request(app).get('/api/products');
    for (const product of res.body) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('inStock');
    }
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=electronics');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const product of res.body) {
      expect(product.category.toLowerCase()).toBe('electronics');
    }
  });

  it('should filter by category case-insensitively', async () => {
    const res = await request(app).get('/api/products?category=ELECTRONICS');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const product of res.body) {
      expect(product.category.toLowerCase()).toBe('electronics');
    }
  });

  it('should return empty array for non-matching category', async () => {
    const res = await request(app).get('/api/products?category=nonexistent');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return empty array for invalid category', async () => {
    const res = await request(app).get('/api/products?category=xyz123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
