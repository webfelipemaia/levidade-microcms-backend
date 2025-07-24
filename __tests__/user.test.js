const request = require('supertest');
const app = require('../server');
const db = require('../helpers/db.js');

describe('User API', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        lastname: 'Doe'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User created');

    const user = await db.User.findOne({ where: { email: 'test@example.com' } });
    expect(user).not.toBeNull();
    expect(user.name).toBe('John');
    expect(user.lastname).toBe('Doe');
  });

  it('should not create a user with an existing email', async () => {
    await db.User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'John',
      lastname: 'Doe'
    });

    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Jane',
        lastname: 'Doe'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email "test@example.com" is already registered');
  });
});
