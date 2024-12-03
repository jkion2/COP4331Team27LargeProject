const request = require('supertest');
const app = require('../server'); // Adjust as needed.

describe('Server Health', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });
});
