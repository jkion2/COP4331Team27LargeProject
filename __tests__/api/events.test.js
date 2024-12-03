const request = require('supertest');
const app = require('../../server');

describe('Events API', () => {
  it('should fetch events filtered by date and userId', async () => {
    const response = await request(app)
      .get('/api/events')
      .query({ userId: '674c0a6f19a10988fb7f4894', dateFilter: '2024-12-02' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('title');
  });

  it('should return 404 if event not found', async () => {
    const response = await request(app)
      .get('/api/events')
      .query({ eventId: 'nonexistentid' });

    expect(response.status).toBe(404);
  });
});
