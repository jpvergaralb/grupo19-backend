const express = require('express');

const {
  getUsers,
  getUser,
  postUser,
  postIncreaseWallet,
} = require('../controllers/user.controller');

const userRoutes = express.Router();

userRoutes.route('/')
  .get(getUsers)
  .post(postUser);

userRoutes.route('/wallet/:id')
  .post(postIncreaseWallet);

userRoutes.route('/:id')
  .get(getUser);

module.exports = userRoutes;
