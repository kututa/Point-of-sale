import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { prisma } from '../config/database';

describe('Sales Routes', () => {
  let authToken: string;
  let testItemId: string;

  beforeEach(async () => {
    // Clear database
    await prisma.sale.deleteMany();
    await prisma.inventory.deleteMany();

    // Create test user and get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'attendant@test.com',
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

  it('should create a new sale', async () => {
    const saleData = {
      itemId: testItemId,
      quantity: 2,
      sellingPrice: 200,
    };

    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${authToken}`)
      .send(saleData);

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(saleData.quantity);
    expect(response.body.sellingPrice).toBe(saleData.sellingPrice);

    // Check if inventory was updated
    const updatedItem = await prisma.inventory.findUnique({
      where: { id: testItemId },
    });
    expect(updatedItem?.quantity).toBe(8); // Original 10 - 2 sold
  });

  it('should not create sale with insufficient inventory', async () => {
    const saleData = {
      itemId: testItemId,
      quantity: 15, // More than available
      sellingPrice: 200,
    };

    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${authToken}`)
      .send(saleData);

    expect(response.status).toBe(400);
  });

  it('should get sales by date range', async () => {
    const response = await request(app)
      .get('/api/sales/date-range')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get sales statistics', async () => {
    const response = await request(app)
      .get('/api/sales/stats')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_sum');
    expect(response.body).toHaveProperty('_avg');
  });
});