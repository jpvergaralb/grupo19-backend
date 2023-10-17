const db = require('../../models');
const { Op } = require('sequelize');

const Stock = db.stock;

const makePrediction = async (req, res) => {

  const { timeFrame, symbol} = req.query;

  if (!timeFrame || !symbol) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // const fetchedStockData = await fetchStockData(dataRage, symbol);
    // const validatedPurchasesCount = await getValidatedPurchasesCount(symbol);

    // console.log(validatedPurchasesCount);
    // console.log(fetchedStockData);
    const stockData = await fetchStockData(timeFrame, symbol)
    //axios.post(a la api de workers)
    return res.status(200).json({ message: 'Prediction created', stockData});
  
    
  } catch (error) {
    return res.status(500).json( error );
  }
}


//RETORNA LOS STOCKS DE 100 EN 100 DESDE HASTA EL TIMEFRAME INDICADO
async function fetchStockData(timeFrame, symbol) {
  const LIMIT = 100;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - timeFrame); 
  console.log(startDate, endDate)

  const countAll = await Stock.count();
  console.log(countAll);

  // Hace una consulta para obtener el total de registros y los primeros 100 registros
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

  // Si hay más registros por obtener, sigue consultando
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

  return stocks;
}

// RETORNA LA CANTIDAD DE COMPORAS VALIDADAS DE LO S ULTIMOS 7 DIAS PARA UN STOCK
const getValidatedPurchasesCount = async (symbol) => {
  return;
}

module.exports = {
  makePrediction,
};
