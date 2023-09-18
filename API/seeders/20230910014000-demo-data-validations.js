'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('validations', [
      { request_id: '8a04cb0b-9c2a-4895-1e5c-95626ad9d1f0',
        group_id: '13',
        seller: 0,
        valid: false,
        createdAt: new Date(),
        updatedAt: new Date() },
      
      { request_id: 'd976f86a-4f94-11ee-be56-0242ac120002',
        group_id: '2',
        seller: 0,
        valid: false,
        createdAt: new Date(),
        updatedAt: new Date() },
      
      { request_id: 'dd7dc22c-4f94-11ee-be56-0242ac120002',
        group_id: '1',
        seller: 0,
        valid: true,
        createdAt: new Date(),
        updatedAt: new Date() },
    ], {});
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('validations', null, {});
  }
};
