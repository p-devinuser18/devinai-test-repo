const request = require('supertest');
const app = require('../src/app');
const products = require('../src/data/products.json');

describe('GET /api/products', () => {
  it('should return all products when no category filter is provided', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(products.length);
    res.body.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('inStock');
    });
  });

  it('should filter products by category (case-insensitive)', async () => {
    const res = await request(app).get('/api/products?category=Electronics');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('electronics');
    });
  });

  it('should return empty array when no products match the category', async () => {
    const res = await request(app).get('/api/products?category=nonexistent');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should return empty array for an invalid category', async () => {
    const res = await request(app).get('/api/products?category=foobar123');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should handle lowercase category filter', async () => {
    const res = await request(app).get('/api/products?category=sports');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('sports');
    });
  });

  it('should handle uppercase category filter', async () => {
    const res = await request(app).get('/api/products?category=KITCHEN');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((product) => {
      expect(product.category.toLowerCase()).toBe('kitchen');
    });
  });
});
