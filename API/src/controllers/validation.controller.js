const Validation = require('../models/validation.model')

const getValidations = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1;
  const size = Math.max(1, req.query.size) || 25;
  const offset = (page - 1) * size;
  
  try {
    const validations = await Validation.findAll({
      limit: size,
      offset: offset,
    });
    
    if (validations.length > 0) {
      res.status(200).json({validations});
      
    } else {
      res.status(404).json({message: "No validations found"});
    }
    
  } catch (error) {
    res.status(500).json({error});
  }
}

const getValidationsByGroup = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;
  
  try {
    const { group } = req.params;
    const validations = await Validation.findAll({
      where: {
        group_id: group
      },
      limit: size,
      offset: offset,
    });
    
    if (validations.length > 0) {
      res.status(200).json({validations});
      
    } else {
      res.status(404).json({message: "No validations found"});
    }
    
  } catch (error) {
    res.status(500).json({error});
  }
}

const getValidationsBySeller = async (req, res) => {
  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;
  
  try {
    const { seller } = req.params;
    
    const validations = await Validation.findAll({
      where: {
        seller: parseInt(seller)
      },
      limit: size,
      offset: offset,
    });
    
    if (validations.length > 0) {
      res.status(200).json({validations});
      
    } else {
      res.status(404).json({message: "No validations found"});
    }
    
  } catch (error) {
    res.status(500).json({error});
  }
}

const getValidationsByValid = async (req, res) => {
  // http(s)://host:port/is_valid=<true/false>
  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size
  
  try {
    const { is_valid } = req.params
    
    let validations = [];
    
    if (is_valid.toLowerCase() !== 'true' || is_valid.toLowerCase() !== 'false') {
      res.status(400).json({message: "Invalid value for is_valid. Must be 'true' or 'false'"});
      
    } else if (is_valid.toLowerCase() === 'true') {
      validations = await Validation.findAll({
        where: {
          valid: true
        },
        limit: size,
        offset: offset,
      });
      
    } else {
      validations = await Validation.findAll({
        where: {
          valid: false
        },
        limit: size,
        offset: offset,
      });
    }
    
    if (validations.length > 0) {
      res.status(200).json({validations});
      
    } else {
      res.status(404).json({message: "No validations found"});
    }
    
  } catch (error) {
    res.status(500).json({error});
  }
}

const postValidation = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message field is missing" });
    }
    
    const data = JSON.parse(message);
    if (!data.validations) {
      return res.status(400).json({ message: "Validations field is missing" });
    }
    
    const validations = JSON.parse(data.validations);
    const results = [];
    
    for (const validation of validations) {
      const { request_id, group_id, seller, valid } = validation;
      
      if (!request_id || !group_id || !seller || !valid) {
        results.push({ message: `Missing fields for stock ${request_id || ''}` });
        continue;
      }
      
      try {
        await Validation.create({
          request_id,
          group_id,
          seller,
          valid,
        });
        
        results.push({ message: `Validation ${request_id} from ${group_id} registered` });
        
      } catch (error) {
        results.push({ message: `Error including validation ${request_id}`, error: error.message });
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
