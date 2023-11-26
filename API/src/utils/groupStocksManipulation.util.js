const db = require('../../models');

const OurStocks = db.ourStocks;
const StocksOwners = db.stocksOwners;

/* Admin aumentó stocks del grupo
 * --> Intercambiamos con otro grupo
 * --> Compra a los ayudantes (broker)
 * TODO: Poner un toast notification que digan "Han aumentado/disminuido los stocks de <SYMBOL> en <CANTIDAD>"
 * TODO: DECIRLE AL CLIENTE QUE ACTUALICE LA PÁGINA (solución parche)
 */
const addStocksToTheGroup = async (stock_symbol, amount) => {
  try {
    let creado = false;
    await OurStocks.findOrCreate({
      where: { stock_symbol },
      defaults: { quantity: amount },
    })
      .then(([, created]) => {
        if (created) {
          creado = true;
        }
      });
    if (!creado) {
      const stock = await OurStocks.findOne({ where: { stock_symbol } });
      await OurStocks.update({ quantity: stock.quantity + amount }, { where: { stock_symbol } });
    }
  } catch (error) {
    console.log('🚨🚔 | Error creating or updating the stock quantity.');
    console.log(`🚨🚔 | ${error}`);
  }
};


/* Admin disminuyó stocks del grupo
* --> Un usuario de nuestra aplicacion nos compra acciones de nuetro pool o cuando nosotros subastamos
* TODO: Poner un toast notification que digan "Han aumentado/disminuido los stocks de <SYMBOL> en <CANTIDAD>"
* TODO: DECIRLE AL CLIENTE QUE ACTUALICE LA PÁGINA (solución parche)
* */

const reduceStocksToTheGroup = async (stock_symbol, amount) => {
  try {
    const stocks = await OurStocks.findOne({ where: { stock_symbol } });
    if (stocks) {
      if (stocks.quantity >= amount) {
        await OurStocks.update({ quantity: stocks.quantity - amount }, { where: { stock_symbol } });
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

/* Sólo se ejecuta cuando un usuairo compra acciones.
* TODO: Usuario <X> ha comprado <CANTIDAD> acciones de <SYMBOL>
* */
const addStocksToAUser = async (user_id, stock_symbol, amount) => {
  try {
    let creado = false;
    await StocksOwners.findOrCreate({
      where: { user_id, stock_symbol },
      defaults: { quantity: amount },
    })
      .then(([, created]) => {
        if (created) {
          creado = true;
        }
      });
    if (!creado) {
      const stock = await StocksOwners.findOne({ where: { user_id, stock_symbol } });
      await StocksOwners.update(
        { quantity: stock.quantity + amount },
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
