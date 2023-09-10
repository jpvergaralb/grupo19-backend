const Request = require('../models/request.model')

const getRequests = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1
  const size = Math.max(1, req.query.size) || 25
  const offset = (page - 1) * size
  
  try {
    const requests = await Request.findAll({
      limit: size,
      offset: offset,
    })
    
    if (requests.length > 0) {
      res.status(200).json({requests})
      
    } else {
      res.status(404).json({message: "No requests found"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
}

const getRequestsByGroupId = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1
  const size = Math.min(1, req.query.size) || 25
  const offset = (page - 1) * size
  
  try {
    const { group } = req.params
    const request = await Request.findAll({
      where: {
        group_id: group
      },
      limit: size,
      offset: offset,
    })
    
    if (request.length > 0) {
      res.status(200).json({request})
    } else {
      res.status(404).json({message: "No requests found"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
}

const getRequestsBySymbol = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1
  const size = Math.min(1, req.query.size) || 25
  const offset = (page - 1) * size
  
  try {
    const { symbol } = req.params
    const request = await Request.findAll({
      where: {
        symbol: symbol
      },
      limit: size,
      offset: offset,
    })
    
    if (request.length > 0) {
      res.status(200).json({request})
    } else {
      res.status(404).json({message: "No requests found"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
}

const getRequestsBySeller = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1
  const size = Math.min(1, req.query.size) || 25
  const offset = (page - 1) * size
  
  try {
    const { symbol } = req.params
    const request = await Request.findAll({
      where: {
        seller: parseInt(symbol)
      },
      limit: size,
      offset: offset,
    })
    
    if (request.length > 0) {
      res.status(200).json({request})
    } else {
      res.status(404).json({message: "No requests found"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
}

const postRequests = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message field is missing" });
    }
    
    const data = JSON.parse(message);
    if (!data.requests) {
      return res.status(400).json({ message: "Requests field is missing" });
    }
    
    const requests = data;
    const results = [];
    
    for (const request of requests) {
      const { request_id, group_id, symbol, datetime, deposit_token, quantity, seller } = request;
      
      if (
        !request_id ||
        !group_id ||
        !symbol ||
        !datetime ||
        !deposit_token ||
        !quantity ||
        !seller
      ) {
        results.push({ message: `Missing fields for stock ${request_id || ''}` });
        continue;
      }
      
      try {
        await Request.create({
          request_id,
          group_id,
          symbol,
          datetime,
          deposit_token,
          quantity,
          seller,
        });
        
        results.push({ message: `Request ${request_id} @ ${datetime}` });
        
      } catch (error) {
        results.push({ message: `Error creating request ${request_id}`, error: error.message });
      }
    }
    
    res.status(201).json({ results });
  } catch (error) {
    res.status(400).json({ message: "Bad Request", error: error.message });
  }
};



module.exports = {
  getRequests,
  postRequests,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller
}
