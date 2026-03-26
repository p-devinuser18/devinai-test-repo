const request = require('supertest');
const app = require('../src/app');
const { version } = require('../package.json');

describe('GET /stats', () => {
  it('should return 200 status code', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toBe(200);
  });

  it('should return JSON content type', async () => {
    const res = await request(app).get('/stats');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return totalRequests as a number', async () => {
    const res = await request(app).get('/stats');
    expect(typeof res.body.totalRequests).toBe('number');
    expect(res.body.totalRequests).toBeGreaterThanOrEqual(1);
  });

  it('should return endpointCounts as an object', async () => {
    const res = await request(app).get('/stats');
    expect(typeof res.body.endpointCounts).toBe('object');
    expect(res.body.endpointCounts).not.toBeNull();
  });

  it('should return uptimeSeconds as a non-negative number', async () => {
    const res = await request(app).get('/stats');
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('should return version matching package.json', async () => {
    const res = await request(app).get('/stats');
    expect(res.body.version).toBe(version);
  });

  it('should not require authentication', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toBe(200);
  });

  it('should track requests to other endpoints', async () => {
    await request(app).get('/health');
    const res = await request(app).get('/stats');
    expect(res.body.endpointCounts['GET /health']).toBeGreaterThanOrEqual(1);
  });
});
