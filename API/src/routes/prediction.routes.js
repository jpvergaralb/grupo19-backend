const express = require('express');

const predictionRoutes = express.Router();

const {
  makePrediction,
  getPredictions,
  getPrediction,
} = require('../controllers/prediction.controller');

predictionRoutes.route('/')
  .post(makePrediction)
  .get(getPredictions);

predictionRoutes.route('/:id')
  .get(getPrediction);

module.exports = predictionRoutes;
