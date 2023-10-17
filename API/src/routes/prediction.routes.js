const express = require('express');

const predictionRoutes = express.Router();

const {
  makePrediction,
} = require('../controllers/prediction.controller');

predictionRoutes.route('/')
  .get(makePrediction);

module.exports = predictionRoutes;
