'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('stocks', [
      { symbol: 'AAPL', shortName: 'Apple Inc.', price: 150.69, currency: 'USD', source: 'NASDAQ', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'GOOGL', shortName: 'Alphabet Inc.', price: 2753.49, currency: 'USD', source: 'NASDAQ', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'AMZN', shortName: 'Amazon.com Inc.', price: 3352.15, currency: 'USD', source: 'NASDAQ', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'MSFT', shortName: 'Microsoft Corp.', price: 287.12, currency: 'USD', source: 'NASDAQ', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'TSLA', shortName: 'Tesla Inc.', price: 687.20, currency: 'USD', source: 'NASDAQ', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stocks', null, {});
  }
};
