const express = require('express')
const { 
  getStocks, 
  postStock,
  getStocksByName 
} = require('../controllers/stock.controller')

const stockRoutes = express.Router()

stockRoutes.route('/')
          .get(getStocks)
          .post(postStock)

stockRoutes.route('/:name')
          .get(getStocksByName)

module.exports = stockRoutes