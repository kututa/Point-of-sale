import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { prisma } from '../config/database';
import { UserRole } from '../../types/auth';

describe('Inventory Routes', () => {
  let authToken: string;
  let testItemId: string;

  beforeEach(async () => {
    // Clear database
    await prisma.inventory.deleteMany();

    // Create test user and get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      });

    authToken = response.body.token;

    // Create test inventory item
    const item = await prisma.inventory.create({
      data: {
        name: 'Test Item',
        category: 'Test Category',
        description: 'Test Description',
        buyingPrice: 100,
        sellingPrice: 200,
        quantity: 10,
      },
    });

    testItemId = item.id;
  });

  it('should get all inventory items', async () => {
    const response = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should create a new inventory item', async () => {
    const newItem = {
      name: 'New Item',
      category: 'New Category',
      description: 'New Description',
      buyingPrice: 150,
      sellingPrice: 300,
      quantity: 5,
    };

    const response = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newItem);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newItem);
  });

  it('should update an existing inventory item', async () => {
    const updates = {
      name: 'Updated Item',
      quantity: 15,
    };

    const response = await request(app)
      .put(`/api/inventory/${testItemId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updates.name);
    expect(response.body.quantity).toBe(updates.quantity);
  });

  it('should delete an inventory item', async () => {
    const response = await request(app)
      .delete(`/api/inventory/${testItemId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);

    const item = await prisma.inventory.findUnique({
      where: { id: testItemId },
    });
    expect(item).toBeNull();
  });
});