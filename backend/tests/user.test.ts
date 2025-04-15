import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { prisma } from '../config/database';
import { UserRole } from '../../types/auth';

describe('User Routes', () => {
  let adminToken: string;
  let testUserId: string;

  beforeEach(async () => {
    // Clear database
    await prisma.user.deleteMany();

    // Create admin user and get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      });

    adminToken = response.body.token;

    // Create test user
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        role: UserRole.ATTENDANT,
        status: 'ACTIVE',
      },
    });

    testUserId = user.id;
  });

  it('should create a new user', async () => {
    const userData = {
      username: 'newuser',
      fullName: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: UserRole.ATTENDANT,
    };

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(userData.username);
    expect(response.body.email).toBe(userData.email);
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a user', async () => {
    const updates = {
      fullName: 'Updated Name',
      role: UserRole.OWNER,
    };

    const response = await request(app)
      .put(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.fullName).toBe(updates.fullName);
    expect(response.body.role).toBe(updates.role);
  });

  it('should deactivate a user', async () => {
    const response = await request(app)
      .post(`/api/users/${testUserId}/deactivate`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('INACTIVE');
  });

  it('should get user statistics', async () => {
    const response = await request(app)
      .get(`/api/users/${testUserId}/stats`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalSales');
    expect(response.body).toHaveProperty('totalProfit');
  });
});