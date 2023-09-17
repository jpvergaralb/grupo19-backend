const request = require('supertest');
const app = require('../app');
const db = require('../../models');
const {
  correctMockStock,
  noStockMockStock,
  missingFieldsMockStock,
  wrongDataTypesMockStock,
} = require('./utils/stockRoutes.util');

const Stock = db.stock;

describe('Stocks API - General Cases', () => {
  it('should return all stocks', async () => {
    const res = await request(app).get('/stocks');
    expect(res.statusCode).toEqual(200);
  });

  it('should return a stock', async () => {
    const res = await request(app).get('/stocks/MSFT');
    expect(res.statusCode).toEqual(200);
  });

  it('should return all companies symbols', async () => {
    const res = await request(app).get('/stocks/companies');
    expect(res.statusCode).toEqual(200);
  });

  it('should post a stock', async () => {
    const res = await request(app).post('/stocks').send({
      message: correctMockStock,
    });
    expect(res.statusCode).toEqual(201);
  });
});

describe('Stocks API - Error Cases', () => {
  it('should return 500 trying to get a stock by its symbol', async () => {
    Stock.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/stocks/MSFT');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 500 trying to get all stocks', async () => {
    Stock.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/stocks');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 400 trying to post a stock', async () => {
    const res = await request(app).post('/stocks').send({
      message: noStockMockStock,
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should fail because no message was given', async () => {
    const res = await request(app).post('/stocks').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should miss an attribute', async () => {
    const res = await request(app).post('/stocks').send({
      message: missingFieldsMockStock,
    });
    expect(res.statusCode).toEqual(201);
  });

  it('wrong data types while posting a stock', async () => {
    const res = await request(app).post('/stocks').send({
      message: wrongDataTypesMockStock,
    });
    expect(res.statusCode).toEqual(201);
  });

  it('should return 500 trying to get all companies symbols', async () => {
    Stock.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/stocks/companies');
    expect(res.statusCode).toEqual(500);
  });
});
