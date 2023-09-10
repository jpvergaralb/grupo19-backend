const Stock = require('../models/stock.model')

const getStocks = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1
  const size = Math.max(1, req.query.size) || 25
  const offset = (page - 1) * size

  try {
    const stocks = await Stock.findAll({
      limit: size,
      offset: offset,
    })
    
    if (stocks.length > 0) {
      res.status(200).json({stocks})
      
    } else {
      res.status(404).json({message: "No stocks found"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
}

const getStocksByName = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1
  const size = Math.min(1, req.query.size) || 25
  const offset = (page - 1) * size

  try {
    const { name } = req.params
    const stock = await Stock.findAll({
      where: {
        symbol: name
      },
      limit: size,
      offset: offset,
    })
    
    if (stock.length > 0) {
      res.status(200).json({stock})
    } else {
      res.status(404).json({message: "No stocks found"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
}

const postStock = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message field is missing" });
    }

    const data = JSON.parse(message);
    if (!data.stocks) {
      return res.status(400).json({ message: "Stocks field is missing" });
    }

    const stocks = JSON.parse(data.stocks);
    const results = [];

    for (const stock of stocks) {
      const { symbol, shortName, price, currency, source } = stock;

      if (!symbol || !shortName || !price || !currency || !source) {
        results.push({ message: `Missing fields for stock ${symbol || ''}` });
        continue;
      }

      try {
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
    res.status(400).json({ message: "Bad Request", error: error.message });
  }
};



module.exports = {
  getStocks,
  postStock,
  getStocksByName
}
