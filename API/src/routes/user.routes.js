const express = require('express');

const {
  getUsers,
  getUser,
  getUserRequests,
  postUser,
  postUpdateWallet,
} = require('../controllers/user.controller');

const userRoutes = express.Router();

userRoutes.route('/')
  .get(getUsers)
  .post(postUser);

userRoutes.route('/requests/:id/')
  .get(getUserRequests);

userRoutes.route('/wallet/:id')
  .post(postUpdateWallet);

userRoutes.route('/:id')
  .get(getUser);

module.exports = userRoutes;
