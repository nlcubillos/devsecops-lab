const request = require('supertest');
const app = require('../src/app');

describe('API Tests', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET /users returns paginated list', async () => {
    const res = await request(app).get('/users?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toHaveLength(5);
    expect(res.body.pagination.page).toBe(1);
  });

  test('GET /users with invalid name returns 400', async () => {
    const res = await request(app).get('/users?name[]=bad');
    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  test('GET /users with limit > 100 returns 400', async () => {
    const res = await request(app).get('/users?limit=200');
    expect(res.statusCode).toBe(400);
  });
});