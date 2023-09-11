const Validation = require('../models/validation.model')

const getValidations = async (req, res) => {
  console.log("📠 | GET request recibida a /validations")
  
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
  console.log("📠 | GET request recibida a /validations/group/:group")
  
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
  console.log("📠 | GET request recibida a /validations/seller/:seller")
  
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
  console.log("📠 | GET request recibida a /validations/validation/:is_valid")
  
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
  console.log("📠 | POST request recibida a /validations")
  try {
    const validation = req.body;
    
    if (!validation) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    
    const { request_id, group_id, seller, valid } = validation;
    
    if (!request_id || !group_id || seller === undefined || valid === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const createdValidation = await Validation.create({
      request_id,
      group_id,
      seller,
      valid,
    });
    
    if (!createdValidation) {
      console.error("Failed to create validation in the database.");
      return res.status(500).json({ message: "Failed to register validation." });
    }
    
    res.status(201).json({ message: `Validation ${request_id} from ${group_id} registered` });
    
  } catch (error) {
    console.error("Error in postValidation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getValidations,
  getValidationsByGroup,
  getValidationsBySeller,
  getValidationsByValid,
  postValidation
}
