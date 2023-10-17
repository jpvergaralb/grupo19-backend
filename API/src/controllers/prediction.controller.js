const { Op } = require('sequelize');
const db = require('../../models');

const Stock = db.stock;
const Validation = db.validation;

const makePrediction = async (req, res) => {
  const { timeFrame, symbol } = req.query;

  if (!timeFrame || !symbol) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // eslint-disable-next-line no-use-before-define
    const validatedPurchasesCount = await getValidatedPurchasesCount(symbol);
    // eslint-disable-next-line no-use-before-define
    const stocks = await fetchStockData(timeFrame, symbol);
    // axios.post('http://workers:7777/path', { stocks, validatedPurchasesCount })
    return res.status(200).json({ count: validatedPurchasesCount, data: stocks });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

async function fetchStockData(timeFrame, symbol) {
  const LIMIT = 100;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - timeFrame);

  const { count, rows } = await Stock.findAndCountAll({
    where: {
      symbol,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit: LIMIT,
    attributes: ['createdAt', 'price'],
  });

  let stocks = rows;

  for (let offset = LIMIT; offset < count; offset += LIMIT) {
    // eslint-disable-next-line no-await-in-loop
    const additionalStocks = await Stock.findAll({
      where: {
        symbol,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      limit: LIMIT,
      offset,
      attributes: ['createdAt', 'price'],
    });
    stocks = stocks.concat(additionalStocks);
  }

  console.log(`\nFound ${count} ${symbol} stocks in the last ${timeFrame} days 💰\n`);

  return stocks;
}

const getValidatedPurchasesCount = async (symbol) => {
  const endDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(endDate.getDate() - 7);

  const validations = await Validation.findAll({
    where: {
      valid: true,
      createdAt: {
        [Op.between]: [sevenDaysAgo, endDate],
      },
    },
  });

  const requests = await Promise.all(validations.map((validation) => validation.getRequest()));
  const validationsRequests = requests.filter((request) => request.symbol === symbol);

  return validationsRequests.length;
};

module.exports = {
  makePrediction,
};
