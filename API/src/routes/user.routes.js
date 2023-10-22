const express = require('express');

const {
  getUsers,
  getUser,
  getUserByAuthId,
  getUserRequests,
  getUserPredictions,
  getLastUserPrediction,
  postUser,
  postUpdateWallet,
  updateUsersPhone,
} = require('../controllers/user.controller');

const userRoutes = express.Router();

userRoutes.route('/')
  .get(getUsers)
  .post(postUser);

userRoutes.route('/requests/:id/')
  .get(getUserRequests);

userRoutes.route('/auth/:id')
  .get(getUserByAuthId);

userRoutes.route('/update')
  .post(updateUsersPhone);

userRoutes.route('/predictions/:id')
  .get(getUserPredictions);

userRoutes.route('/prediction/:id')
  .get(getLastUserPrediction);

userRoutes.route('/wallet/:id')
  .post(postUpdateWallet);

userRoutes.route('/:id')
  .get(getUser);

module.exports = userRoutes;
