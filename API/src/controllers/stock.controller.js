const db = require('../../models');

const Stock = db.stock;
const OurStocks = db.ourStocks;

const getStocks = async (req, res) => {
  console.log('📠| GET request recibida a /stocks');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.max(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const stocks = await Stock.findAll({
      limit: size,
      offset,
    });

    if (stocks.length > 0) {
      res.status(200).json({ stocks });
    } else {
      res.status(404).json({ message: 'No stocks found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
  console.log('📞| Fin del mensaje a /stocks');
};

const getStocksByName = async (req, res) => {
  console.log('📠| GET request recibida a /stocks/:name');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.max(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { name } = req.params;
    const stock = await Stock.findAll({
      where: {
        symbol: name,
      },
      limit: size,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (stock.length > 0) {
      res.status(200).json({ stock });
    } else {
      res.status(404).json({ message: 'No stocks found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
  console.log('📞| Fin del mensaje a /stocks/:name');
};

const postStock = async (req, res) => {
  console.log('📠| POST request recibida a /stocks');

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message field is missing' });
    }

    const data = JSON.parse(message);
    if (!data.stocks) {
      return res.status(400).json({ message: 'Stocks field is missing' });
    }

    const stocks = JSON.parse(data.stocks);
    const results = [];
    console.log(stocks)

    // eslint-disable-next-line no-restricted-syntax
    for (const stock of stocks) {
      const {
        symbol, shortName, price, currency, source,
      } = stock;

      if (!symbol || !shortName || !price || !currency || !source) {
        results.push({ message: `Missing fields for stock ${symbol || ''}` });
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        await Stock.create({
          symbol,
          shortName,
          price,
          currency,
          source,
        });

        results.push({ message: `Stock ${symbol} created at ${price}` });
      } catch (error) {
        results.push({ message: `Error listing stock ${symbol}`, error: error.message });
      }
    }

    res.status(201).json({ results });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
  console.log('📞| Fin del mensaje a /stocks');
  return null;
};

const getCompaniesSymbol = async (req, res) => {
  try {
    const companiesNames = await Stock.findAll({
      attributes: ['symbol'],
      group: ['symbol'],
    });
    if (companiesNames.length > 0) {
      res.status(200).json({ companiesNames });
    } else {
      res.status(404).json({ message: 'No companies found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getOurStocksByName = async (req, res) => {
  console.log('📠| GET request recibida a /stocks/ourStocks/:name');

  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: 'Name field is missing' });
    }

    const stock = await OurStocks.findOne({ where: { stock_symbol: name } });

    let quantity = 0;

    if (stock) {
      quantity = stock.quantity;
    }

    res.status(200).json({ message: 'Success', quantity });
  } catch (error) {
    res.status(500).json({ error });
  }
  console.log('📞| Fin del mensaje a /stocks/ourStocks/:name');
};

const getAllOurStocks = async (req, res) => {
  console.log('📠| GET request recibida a /stocks/ourStocks');

  try {
    const stocks = await OurStocks.findAll();

    if (stocks.length > 0) {
      res.status(200).json({ stocks });
    } else {
      console.log('No stocks found');
      res.status(404).json({ message: 'No stocks found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
  console.log('📞| Fin del mensaje a /stocks/ourStocks');
};

module.exports = {
  getStocks,
  postStock,
  getStocksByName,
  getCompaniesSymbol,
  getOurStocksByName,
  getAllOurStocks,
};
