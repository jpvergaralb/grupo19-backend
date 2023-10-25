const request = require('supertest');
const app = require('../app');
const db = require('../../models');
const {
  sellerMockId,
  statusMock,
  missingFieldValidationMock,
} = require('./utils/validationRoutes.util');

const Validation = db.validation;

describe('Validations API - General Cases', () => {
  it('should return all validations', async () => {
    const res = await request(app).get('/validations');
    expect(res.statusCode).toEqual(200);
  });

  it('should return all validations by they seller', async () => {
    const res = await request(app).get(`/validations/seller/${sellerMockId}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should return validations by group id', async () => {
    const res = await request(app).get('/validations/group/19');
    expect(res.statusCode).toEqual(200);
  });

  it('shoudl return validationts by status', async () => {
    const res = await request(app).get(`/validations/valid/${statusMock}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe('Validations API - Error Cases', () => {
  it('should return 404 trying to get a validation by its id', async () => {
    Validation.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get(`/validations/${sellerMockId}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should return 500 trying to get all validations', async () => {
    Validation.findAll = jest.fn(() => {
      throw new Error('Database error');
    });
    const res = await request(app).get('/validations');
    expect(res.statusCode).toEqual(500);
  });

  it('should return 500 trying to post a validation', async () => {
    const res = await request(app).post('/validations').send(missingFieldValidationMock);
    expect(res.statusCode).toEqual(400);
  });
});
