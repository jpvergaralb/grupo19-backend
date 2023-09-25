const express = require('express')

const {
  postRequests,
} = require('../controllers/request.controller')

const requestRoutes = express.Router()

requestRoutes.route('/')
  .post(postRequests)

module.exports = requestRoutes
