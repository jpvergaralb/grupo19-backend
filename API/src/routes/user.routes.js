const express = require('express')

const {
    getUsers,
    getUser,
    postUser
} = require('../controllers/user.controller')

const userRoutes = express.Router()

userRoutes.route('/')
          .get(getUsers)
          .post(postUser)

userRoutes.route('/:id')
          .get(getUser)

module.exports = userRoutes
