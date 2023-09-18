'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('requests', [
      { id: '8a04cb0b-9c2a-4895-1e5c-95626ad9d1f0',
        stock_id: 2,
        user_id: '8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0',
        group_id: '13',
        symbol: "AAPL",
        datetime: new Date(),
        deposit_token: 'rHagzMPLwfJCXDXW2sNJZRxygCaYmaO6',
        quantity: 1,
        seller: 0,
        createdAt: new Date(),
        updatedAt: new Date() },
      
      {  id: uuidv4(),
        stock_id: 1,
        user_id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f1",
        group_id: '2',
        symbol: "AMZN",
        datetime: new Date(),
        deposit_token: 'wxYOxbeQLHcYCJGj5GdnOKblj1hsrSiW',
        quantity: 3,
        seller: 0,
        createdAt: new Date(),
        updatedAt: new Date() },
      
      {  id: uuidv4(),
        stock_id: 3,
        user_id: "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f2",
        group_id: '1',
        symbol: "GOOGL",
        datetime: new Date(),
        deposit_token: 'bi33YNacrEHxmiez6NCvhoGd5Xlea95q',
        quantity: 1,
        seller: 0,
        createdAt: new Date(),
        updatedAt: new Date() },
    ], {});
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('requests', null, {});
  }
};
