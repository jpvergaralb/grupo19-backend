const express = require('express')

const {
  getMQTT
} = require('../controllers/root.controller')

const rootRoutes = express.Router()

rootRoutes.route('/')
  .get(getMQTT)

module.exports = rootRoutes
