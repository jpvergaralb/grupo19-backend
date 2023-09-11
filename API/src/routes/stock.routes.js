const express = require('express')

const {
  getStocks,
  postStock,
  getStocksByName,
  getCompaniesSymbol
} = require('../controllers/stock.controller')

const stockRoutes = express.Router()

stockRoutes.route('/')
          .get(getStocks)
          .post(postStock)

stockRoutes.route('/companies')
          .get(getCompaniesSymbol)

stockRoutes.route('/:name')
          .get(getStocksByName)

module.exports = stockRoutes
