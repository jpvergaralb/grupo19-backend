const express = require('express')
const { 
    postUser
} = require('../controllers/user.controller')

const userRoutes = express.Router()

userRoutes.route('/')
          .post(postUser)

module.exports = userRoutes