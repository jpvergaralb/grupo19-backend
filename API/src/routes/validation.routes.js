const express = require('express');

const {
  getValidations,
  getValidationsByGroup,
  getValidationsBySeller,
  getValidationsByValid,
  postValidation,
} = require('../controllers/validation.controller');

const validationRoutes = express.Router();

validationRoutes.route('/')
  .get(getValidations)
  .post(postValidation);

validationRoutes.route('/group/:group')
  .get(getValidationsByGroup);

validationRoutes.route('/seller/:seller')
  .get(getValidationsBySeller);

validationRoutes.route('/valid/:is_valid')
  .get(getValidationsByValid);

module.exports = validationRoutes;
