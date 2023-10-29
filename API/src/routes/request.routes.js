const express = require('express');

const {
  getRequests,
  postRequests,
  updateRequestStatus,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller,
  createRequestToWebpay,
  commitRequestToWebpay,
} = require('../controllers/request.controller');

const requestRoutes = express.Router();

requestRoutes.route('/')
  .get(getRequests)
  .post(postRequests);

requestRoutes.route('/updateRequestStatus')
  .post(updateRequestStatus);

requestRoutes.route('/group/:group')
  .get(getRequestsByGroupId);

requestRoutes.route('/symbol/:symbol')
  .get(getRequestsBySymbol);

requestRoutes.route('/seller/:seller')
  .get(getRequestsBySeller);

requestRoutes.route('/webpay/create')
  .post(createRequestToWebpay);

requestRoutes.route('/webpay/commit')
  .post(commitRequestToWebpay);

module.exports = requestRoutes;
