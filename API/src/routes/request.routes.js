const express = require('express');

const {
  getRequests,
  postRequests,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller,
} = require('../controllers/request.controller');

const requestRoutes = express.Router();

requestRoutes.route('/')
  .get(getRequests)
  .post(postRequests);

requestRoutes.route('/group/:group')
  .get(getRequestsByGroupId);

requestRoutes.route('/symbol/:symbol')
  .get(getRequestsBySymbol);

requestRoutes.route('/seller/:seller')
  .get(getRequestsBySeller);

module.exports = requestRoutes;
