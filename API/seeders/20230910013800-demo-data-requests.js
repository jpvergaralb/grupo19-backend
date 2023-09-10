'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('requests', [
      { request_id: '63fe8daa-4f94-11ee-be56-0242ac120002',
        group_id: '13',
        symbol: "AAPL",
        datetime: new Date(),
        deposit_token: 'rHagzMPLwfJCXDXW2sNJZRxygCaYmaO6',
        quantity: 1,
        seller: 0,
        createdAt: new Date(),
        updatedAt: new Date() },
      
      { request_id: 'd976f86a-4f94-11ee-be56-0242ac120002',
        group_id: '2',
        symbol: "AMZN",
        datetime: new Date(),
        deposit_token: 'wxYOxbeQLHcYCJGj5GdnOKblj1hsrSiW',
        quantity: 3,
        seller: 0,
        createdAt: new Date(),
        updatedAt: new Date() },
      
      { request_id: 'dd7dc22c-4f94-11ee-be56-0242ac120002',
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
