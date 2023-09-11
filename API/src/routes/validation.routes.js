const express = require('express')

const {
  getValidations,
  getValidationsByGroup,
  getValidationsBySeller,
  getValidationsByValid,
  postValidation
} = require('../controllers/validation.controller')

const stockRoutes = express.Router()

stockRoutes.route('/')
  .get(getValidations)
  .post(postValidation)

stockRoutes.route('/group/:group')
  .get(getValidationsByGroup)

stockRoutes.route('/seller/:seller')
  .get(getValidationsBySeller)

stockRoutes.route('/valid/:is_valid')
  .get(getValidationsByValid)

module.exports = stockRoutes
