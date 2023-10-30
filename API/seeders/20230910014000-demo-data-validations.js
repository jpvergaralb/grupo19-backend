'use strict';

const db = require('../models');
const Request = db.request;

const generateRandomDate = () => {
  const start = new Date(2021, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


const generateRandomValidations = async (count) => {
  const validations = [];

  for (let i = 0; i < count; i++) {
    const request = await Request.findOne({ order: db.sequelize.random()})
    const validation = {
      request_id: request.id,
      group_id: 19,
      seller: 0,
      valid: true,
      createdAt: generateRandomDate(),
      updatedAt: generateRandomDate()
    };
    validations.push(validation);
  }
  return validations;
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('validations', await generateRandomValidations(1000), {});
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('validations', null, {});
  }
};
