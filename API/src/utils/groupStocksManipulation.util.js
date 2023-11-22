const { ourStocks, stocksOwners } = require('../../models');

const addStocksToTheGroup = async (stock_symbol, stock_name, amount) => {
  try {
    await ourStocks.findOrCreate({
      where: { stock_symbol },
      defaults: { stock_name, quantity: amount },
    })
      .then(([stock, created]) => {
        if (!created) {
          stock.quantity += amount;
          stock.save();
        }
      });
  } catch (error) {
    console.log('🚨🚔 | Error creating or updating the stock quantity.');
    console.log(`🚨🚔 | ${error}`);
  }
};

const reduceStocksToTheGroup = async (stock_symbol, amount) => {
  try {
    const stocks = await ourStocks.find({ where: { stock_symbol } });
    if (stocks) {
      if (stocks.quantity >= amount) {
        stocks.quantity -= amount;
        stocks.save();
      } else {
        console.log('🚨🚔 | Error reducing the stock quantity.');
        console.log('🚨🚔 | The amount of stocks to reduce is greater than the amount of stocks in the group.');
        return false;
      }
    } else {
      console.log('🚨🚔 | Error reducing the stock quantity.');
      console.log('🚨🚔 | The stock does not exist in the group.');
      return false;
    }
  } catch (error) {
    console.log('🚨🚔 | Updating the stock quantity.');
    console.log(`🚨🚔 | ${error}`);
    return false;
  }
  return true;
};

const addStocksToAUser = async (user_id, stock_symbol, amount) => {
  try {
    await stocksOwners.findOrCreate({
      where: { user_id, stock_symbol },
      defaults: { quantity: amount },
    })
      .then(([stock, created]) => {
        if (!created) {
          stock.quantity += amount;
          stock.save();
        }
      });
  } catch (error) {
    console.log('🚨🚔 | Error creating or updating the stock quantity.');
    console.log(`🚨🚔 | ${error}`);
  }
};

module.exports = {
  addStocksToTheGroup,
  reduceStocksToTheGroup,
  addStocksToAUser,
};
