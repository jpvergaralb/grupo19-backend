'use strict';

const possibleSymbols = [
  'AAPL',
  'GOOGL',
  'AMZN',
  'MSFT',
  'TSLA',
]

const generateRandomDate = () => {
  const start = new Date(2021, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateRandomStocks = (count) => {
  const stocks = [];
  for (let i = 0; i < count; i++) {
    const randomDate = generateRandomDate()
    const stock = {
      symbol: possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)],
      shortName: `Stock ${i}`,
      price: Math.random() * 100,
      currency: 'USD',
      source: 'NASDAQ',
      createdAt: randomDate,
      updatedAt: randomDate,
    };

    stocks.push(stock);
  }

  return stocks;
}

module.exports = {
  async up (queryInterface, Sequelize) {

    const stocks = generateRandomStocks(20000);
    await queryInterface.bulkInsert('stocks', stocks, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stocks', null, {});
  }
};
