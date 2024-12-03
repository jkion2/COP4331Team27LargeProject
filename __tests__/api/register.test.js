const request = require('supertest');
const app = require('../../server');

describe('User Registration', () => {
  it('should register a user and send a verification email', async () => {
    const response = await request(app).post('/api/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.message).toBe('Verification email sent');
  });

  it('should fail if required fields are missing', async () => {
    const response = await request(app).post('/api/register').send({});
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
