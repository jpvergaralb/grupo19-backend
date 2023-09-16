'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        username: 'JohnDoe',
        password: 'Pass@1234',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        cash: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'JaneDoe',
        password: 'Jane@1234',
        email: 'jane.doe@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '1234567891',
        cash: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'BillyBob',
        password: 'Billy@1234',
        email: 'billy.bob@example.com',
        firstName: 'Billy',
        lastName: 'Bob',
        phone: '1234567892',
        cash: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'EmilyRose',
        password: 'Rose@1234',
        email: 'emily.rose@example.com',
        firstName: 'Emily',
        lastName: 'Rose',
        phone: '1234567893',
        cash: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'CharlieBrown',
        password: 'Brown@1234',
        email: 'charlie.brown@example.com',
        firstName: 'Charlie',
        lastName: 'Brown',
        phone: '1234567894',
        cash: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
