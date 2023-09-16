const request = require('supertest');
const app = require('../app');

describe('Stocks API', () => {
  it('should return all stocks', async () => {
    const res = await request(app).get('/stocks');
    expect(res.statusCode).toEqual(200);
  });

});
