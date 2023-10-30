'use strict';

const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const User = db.user;

const possibleSymbols = [
  'AAPL',
  'GOOGL',
  'AMZN',
  'MSFT',
  'TSLA',
]

const generateRandomRequest = async (count) => {
  const requests = [];

  for (let i = 0; i < count; i++) {
    const user = await User.findOne({ order: db.sequelize.random()})
    const request = {
      id: uuidv4(),
      stock_id: Math.floor(Math.random() * 3) + 1,
      user_id: user.id,
      group_id: 19,
      symbol: possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)],
      datetime: new Date(),
      deposit_token: 'rHagzMPLwfJCXDXW2sNJZRxygCaYmaO6',
      quantity: Math.floor(Math.random() * 3) + 1,
      seller: 0,
      total_price: Math.floor(Math.random() * 3) + 1,
      location: '-34.603722, -58.381592',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    requests.push(request);
  }
  return requests;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('requests', await generateRandomRequest(1000), {});
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('requests', null, {});
  }
};
