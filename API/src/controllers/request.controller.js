// const Request = require('../models/request.model')
const db = require('../../models');

const Request = db.request;

const getRequests = async (req, res) => {
  console.log('📠| GET request recibida a /requests');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.max(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const requests = await Request.findAll({
      limit: size,
      offset,
    });

    if (requests.length > 0) {
      res.status(200).json({ requests });
    } else {
      res.status(404).json({ message: 'No requests found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /requests');
};

const getRequestsByGroupId = async (req, res) => {
  console.log('📠| GET request recibida a /requests/group/:group_id');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { group } = req.params;
    const request = await Request.findAll({
      where: {
        group_id: group,
      },
      limit: size,
      offset,
    });

    if (request.length > 0) {
      res.status(200).json({ request });
    } else {
      res.status(404).json({ message: 'No requests found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /requests/group/:group_id');
};

const getRequestsBySymbol = async (req, res) => {
  console.log('📠| GET request recibida a /requests/symbol/:symbol');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { symbol } = req.params;
    const request = await Request.findAll({
      where: {
        symbol,
      },
      limit: size,
      offset,
    });

    if (request.length > 0) {
      res.status(200).json({ request });
    } else {
      res.status(404).json({ message: 'No requests found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /requests/symbol/:symbol');
};

const getRequestsBySeller = async (req, res) => {
  console.log('📠| GET request recibida a /requests/seller/:seller');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { seller } = req.params;
    const request = await Request.findAll({
      where: {
        seller: parseInt(seller, 10),
      },
      limit: size,
      offset,
    });

    if (request.length > 0) {
      res.status(200).json({ request });
    } else {
      res.status(404).json({ message: 'No requests found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /requests/seller/:seller');
};

const postRequests = async (req, res) => {
  console.log('📠| POST request recibida a /requests');

  try {
    const request = req.body;

    if (!request) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const {
      group_id, symbol, datetime, deposit_token, quantity, seller,
    } = request;

    if (
      !group_id
      || !symbol
      || !datetime
      || deposit_token === undefined
      || !quantity
      || seller === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = await Request.create({
      group_id,
      symbol,
      datetime,
      deposit_token,
      quantity,
      seller,
    });

    res.status(201).json({ message: `Request ${newRequest.id} @ ${datetime} created successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }

  console.log('📞| Fin del mensaje a /requests');
  return null;
};

module.exports = {
  getRequests,
  postRequests,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller,
};
