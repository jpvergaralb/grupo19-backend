const express = require('express')

const {
  getRequests,
  postRequests,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller
} = require('../controllers/request.controller')

const stockRoutes = express.Router()

stockRoutes.route('/')
  .get(getRequests)
  .post(postRequests)

stockRoutes.route('/group/:group')
  .get(getRequestsByGroupId)

stockRoutes.route('/symbol/:symbol')
  .get(getRequestsBySymbol)

stockRoutes.route('/seller/:seller')
  .get(getRequestsBySeller)


module.exports = stockRoutes
