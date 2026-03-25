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
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(products.length);
  });

  it('should return each product with correct shape', async () => {
    const res = await request(app).get('/api/products');
    res.body.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('inStock');
    });
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=electronics');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('electronics');
    });
  });

  it('should filter by category case-insensitively', async () => {
    const res = await request(app).get('/api/products?category=ELECTRONICS');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('electronics');
    });
  });

  it('should return empty array for non-existent category', async () => {
    const res = await request(app).get('/api/products?category=nonexistent');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should return empty array for invalid category', async () => {
    const res = await request(app).get('/api/products?category=xyz123');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
