const db = require('../../models');
const { Op } = require('sequelize');

const Stock = db.stock;

const makePrediction = async (req, res) => {

  const { timeFrame, symbol} = req.query;

  if (!timeFrame || !symbol) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // const validatedPurchasesCount = await getValidatedPurchasesCount(symbol);
    const stocks = await fetchStockData(timeFrame, symbol);

    //axios.post('http://workers:7777/path', { stocks, validatedPurchasesCount })
    return res.status(200).json(stocks);
    
  } catch (error) {
    return res.status(500).json( error );
  }
}


async function fetchStockData(timeFrame, symbol) {
  const LIMIT = 100;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - timeFrame); 

  const { count, rows } = await Stock.findAndCountAll({
      where: {
          symbol: symbol,
          createdAt: {
            [Op.between] : [startDate , endDate ]
          }
      },
      limit: LIMIT
  });
  
  let stocks = rows;
  for (let offset = LIMIT; offset < count; offset += LIMIT) {
      const additionalStocks = await Stock.findAll({
          where: {
              symbol: symbol,
              createdAt: {
                  [Op.between]: [startDate, endDate]
              }
          },
          limit: LIMIT,
          offset: offset
      });

      stocks = stocks.concat(additionalStocks);
  }
  stocks.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  console.log(`\nFound ${count} ${symbol} stocks in the last ${timeFrame} days 💰\n`)

  return stocks;
}

// RETORNA LA CANTIDAD DE COMPORAS VALIDADAS DE LO S ULTIMOS 7 DIAS PARA UN STOCK
const getValidatedPurchasesCount = async (symbol) => {
  return;
}

module.exports = {
  makePrediction,
};
