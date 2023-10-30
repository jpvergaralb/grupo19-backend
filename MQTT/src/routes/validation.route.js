const express = require('express')

const {
  postValidations,
} = require('../controllers/validation.controller')

const validationRoutes = express.Router()

validationRoutes.route('/')
  .post(postValidations)

module.exports = validationRoutes
