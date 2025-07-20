const request = require('supertest');
const app = require('../server');

describe('Rate limiting middleware', () => {
  it('should allow requests within the limit', async () => {
    const res = await request(app).get('/api/v1/public/auth/app');
    expect(res.statusCode).toBeLessThan(429);
  });

  it('should block requests exceeding the limit', async () => {
    const limit = 100;
    let res;
    for (let i = 0; i <= limit; i++) {
      res = await request(app).get('/api/v1/public/auth/app');
    }
    expect(res.statusCode).toBe(429);
    expect(res.text).toMatch(/Too many requests/i);
  });
});
