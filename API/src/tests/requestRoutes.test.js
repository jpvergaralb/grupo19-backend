const request = require('supertest');
const app = require('../app');
const db = require('../../models');
const {
  emptyMockRequest,
} = require('./utils/requestRoutes.util');

const Request = db.request;

describe('Requests API - General Cases', () => {
  it('should return all requests', async () => {
    const res = await request(app).get('/requests');
    expect(res.statusCode).toEqual(200);
  });

  it('should get requests by their group id', async () => {
    const res = await request(app).get('/requests/group/19');
    expect(res.statusCode).toEqual(200);
  });

  it('should get requests by their symbol', async () => {
    const res = await request(app).get('/requests/symbol/AAPL');
    expect(res.statusCode).toEqual(200);
  });

  it('should get requests by their seller', async () => {
    const res = await request(app).get('/requests/seller/0');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Requests API - Error Cases', () => {
  it('should return 500 trying to get all requests', async () => {
    Request.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/requests');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 500 trying to get requests by their group id', async () => {
    Request.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/requests/group/19');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 500 trying to get requests by their symbol', async () => {
    Request.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/requests/symbol/AAPL');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 500 trying to get requests by their seller', async () => {
    Request.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/requests/seller/0');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 400 trying to post a bad request', async () => {
    Request.create = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).post('/requests').send(emptyMockRequest);
    expect(res.statusCode).toEqual(400);
  });
});
