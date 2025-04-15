import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { prisma } from '../config/database';
import { UserRole } from '../../types/auth';

describe('Auth Routes', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.ATTENDANT,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });
});