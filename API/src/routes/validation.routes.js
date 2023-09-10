const express = require('express')

const {
  getValidations,
  getValidationsByGroup,
  getValidationsBySeller,
  getValidationsByValid,
  postValidation
} = require('../controllers/stock.controller')

const stockRoutes = express.Router()

stockRoutes.route('/')
  .get(getValidations)
  .post(postValidation)

stockRoutes.route('/:group')
  .get(getValidationsByGroup)

stockRoutes.route('/:seller')
  .get(getValidationsBySeller)

stockRoutes.route('/:is_valid')
  .get(getValidationsByValid)

module.exports = stockRoutes
