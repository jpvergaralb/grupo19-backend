const express = require('express');

const {
  getStocks,
  postStock,
  getStocksByName,
  getCompaniesSymbol,
  getOurStocksByName,
} = require('../controllers/stock.controller');

const stockRoutes = express.Router();

stockRoutes.route('/')
  .get(getStocks)
  .post(postStock);

stockRoutes.route('/companies')
  .get(getCompaniesSymbol);

stockRoutes.route('/:name')
  .get(getStocksByName);

stockRoutes.route('/ourStocks/:name')
  .get(getOurStocksByName);

module.exports = stockRoutes;
