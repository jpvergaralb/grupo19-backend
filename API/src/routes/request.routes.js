const express = require('express');

const {
  getRequests,
  postRequests,
  updateRequestStatus,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller,
  createRequestToWebpayAsUser,
  commitRequestToWebpayAsUser,
  createRequestToWebpayAsAdmin,
  commitRequestToWebpayAsAdmin,
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
  .post(createRequestToWebpayAsUser);

requestRoutes.route('/webpay/commit')
  .post(commitRequestToWebpayAsUser);

requestRoutes.route('/webpay/admin/create')
  .post(createRequestToWebpayAsAdmin);

requestRoutes.route('/webpay/admin/commit')
  .post(commitRequestToWebpayAsAdmin);

module.exports = requestRoutes;
