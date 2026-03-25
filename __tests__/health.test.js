const request = require('supertest');
const fs = require('fs');
const app = require('../src/app');
const { version } = require('../package.json');

describe('GET /health', () => {
  it('should return 200 status code', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  it('should return JSON content type', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return status "ok"', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });

  it('should return uptime as a number', async () => {
    const res = await request(app).get('/health');
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should return version matching package.json', async () => {
    const res = await request(app).get('/health');
    expect(res.body.version).toBe(version);
  });

  it('should not require authentication', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should increase uptime over time', async () => {
    const res1 = await request(app).get('/health');
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const res2 = await request(app).get('/health');
    expect(res2.body.uptime).toBeGreaterThanOrEqual(res1.body.uptime);
  });
});

describe('GET /health/ready', () => {
  it('should return 200 when all dependencies are available', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.checks.products).toBe('ok');
    expect(res.body.checks.orders).toBe('ok');
  });

  it('should return JSON content type', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return 503 when products.json is not accessible', async () => {
    const originalReadFileSync = fs.readFileSync;
    jest.spyOn(fs, 'readFileSync').mockImplementation((filePath, ...args) => {
      if (filePath.includes('products.json')) {
        throw new Error('EACCES: permission denied');
      }
      return originalReadFileSync(filePath, ...args);
    });

    const res = await request(app).get('/health/ready');
    expect(res.statusCode).toBe(503);
    expect(res.body.status).toBe('not ready');
    expect(res.body.checks.products).toBe('fail');
    expect(res.body.checks.orders).toBe('ok');

    fs.readFileSync.mockRestore();
  });

  it('should return 503 when orders.json has a non-ENOENT error', async () => {
    const originalReadFileSync = fs.readFileSync;
    jest.spyOn(fs, 'readFileSync').mockImplementation((filePath, ...args) => {
      if (filePath.includes('orders.json')) {
        const err = new Error('EACCES: permission denied');
        err.code = 'EACCES';
        throw err;
      }
      return originalReadFileSync(filePath, ...args);
    });

    const res = await request(app).get('/health/ready');
    expect(res.statusCode).toBe(503);
    expect(res.body.status).toBe('not ready');
    expect(res.body.checks.products).toBe('ok');
    expect(res.body.checks.orders).toBe('fail');

    fs.readFileSync.mockRestore();
  });

  it('should not require authentication', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ready');
  });
});
