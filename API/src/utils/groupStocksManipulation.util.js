const db = require('../../models');

const OurStocks = db.ourStocks;
const StocksOwners = db.stocksOwners;

const addStocksToTheGroup = async (stock_symbol, amount) => {
  try {
    const intAmount = parseInt(amount, 10);
    let creado = false;
    await OurStocks.findOrCreate({
      where: { stock_symbol },
      defaults: { quantity: intAmount },
    })
      .then(([, created]) => {
        if (created) {
          creado = true;
        }
      });
    if (!creado) {
      const stock = await OurStocks.findOne({ where: { stock_symbol } });
      await OurStocks.update({ quantity: stock.quantity + intAmount }, { where: { stock_symbol } });
    }
  } catch (error) {
    console.log('🚨🚔 | Error creating or updating the stock quantity.');
    console.log(`🚨🚔 | ${error}`);
  }
};

const reduceStocksToTheGroup = async (stock_symbol, amount) => {
  try {
    const intAmount = parseInt(amount, 10);
    const stocks = await OurStocks.findOne({ where: { stock_symbol } });
    if (stocks) {
      if (stocks.quantity >= intAmount) {
        await OurStocks.update(
          { quantity: stocks.quantity - intAmount },
          { where: { stock_symbol } },
        );
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
    const intAmount = parseInt(amount, 10);
    let creado = false;
    await StocksOwners.findOrCreate({
      where: { user_id, stock_symbol },
      defaults: { quantity: intAmount },
    })
      .then(([, created]) => {
        if (created) {
          creado = true;
        }
      });
    if (!creado) {
      const stock = await StocksOwners.findOne({ where: { user_id, stock_symbol } });
      await StocksOwners.update(
        { quantity: stock.quantity + intAmount },
        { where: { user_id, stock_symbol } },
      );
    }
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
