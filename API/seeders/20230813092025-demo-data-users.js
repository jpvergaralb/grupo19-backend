'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0",
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
        id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f1",
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
        id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f2",
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
        id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f3",
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
        id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f4",
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
