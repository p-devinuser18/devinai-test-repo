const request = require('supertest');
const app = require('../src/app');
const users = require('../src/data/users.json');

describe('GET /api/profile/:userId', () => {
  it('should require authentication', async () => {
    const res = await request(app).get('/api/profile/1');
    expect(res.statusCode).toBe(401);
  });

  it('should return 200 for a valid user ID', async () => {
    const res = await request(app)
      .get('/api/profile/1')
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(200);
  });

  it('should return JSON content type', async () => {
    const res = await request(app)
      .get('/api/profile/1')
      .set('Authorization', 'Bearer test-token');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('should return name, email, avatar, and joinDate fields', async () => {
    const res = await request(app)
      .get('/api/profile/1')
      .set('Authorization', 'Bearer test-token');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('avatar');
    expect(res.body).toHaveProperty('joinDate');
  });

  it('should return correct data for user 1', async () => {
    const res = await request(app)
      .get('/api/profile/1')
      .set('Authorization', 'Bearer test-token');
    expect(res.body.name).toBe('Alice Johnson');
    expect(res.body.email).toBe('alice@example.com');
    expect(res.body.avatar).toBe('https://api.example.com/avatars/alice.png');
    expect(res.body.joinDate).toBe('2023-01-15T08:00:00Z');
  });

  it('should return correct data for user 2', async () => {
    const res = await request(app)
      .get('/api/profile/2')
      .set('Authorization', 'Bearer test-token');
    expect(res.body.name).toBe('Bob Smith');
    expect(res.body.email).toBe('bob@example.com');
  });

  it('should return 404 for a non-existent user ID', async () => {
    const res = await request(app)
      .get('/api/profile/999')
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should return 404 for a non-numeric user ID', async () => {
    const res = await request(app)
      .get('/api/profile/abc')
      .set('Authorization', 'Bearer test-token');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should not include the user id in the response', async () => {
    const res = await request(app)
      .get('/api/profile/1')
      .set('Authorization', 'Bearer test-token');
    expect(res.body).not.toHaveProperty('id');
  });
});
