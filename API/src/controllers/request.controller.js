const axios = require('axios');
const db = require('../../models');
const tx = require('../../utils/trx');

const Request = db.request;
const User = db.user;
const Stock = db.stock;
const Transaction = db.transaction;

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
  console.log('📠| POST request recibida a /requests en API');

  try {
    const request = req.body;

    if (!request) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const {
      user_id, group_id, symbol, datetime, deposit_token, quantity, seller,
    } = request;

    if (!user_id
      || !group_id
      || !symbol
      || !datetime
      || deposit_token !== ''
      || !quantity
      || seller === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: `User ${user_id} not found` });
    }
    const lastStock = await Stock.findOne({
      where: { symbol },
      order: [['createdAt', 'DESC']],
    });
    if (!lastStock) {
      return res.status(404).json({ message: `Stock ${symbol} not found` });
    }

    if (await user.CanAffordThisTransaction(quantity, lastStock.price) === false) {
      console.log(`🚨🚔 | User ${user.username} cannot afford ${quantity} stocks of ${symbol} at ${lastStock.price}$`);
      return res.status(400).json({ message: 'error' });
    }
    const location = await user.processUserLocation(req);
    console.log(`📍 | User ${user.username} sent a buy request from ${location}`);

    const newRequest = await Request.create({
      user_id,
      stock_id: lastStock.id,
      group_id,
      symbol,
      datetime,
      deposit_token,
      quantity,
      seller,
      location,
    });

    const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_REQUESTS_PATH}`;
    console.log(`Posting to ${url}`);
    const response = await axios.post(url, newRequest);

    if (response.status !== 201) {
      return res.status(500).json({ message: 'Internal Server Error: couldnt post the buy request.' });
    }
    return res.status(201).json({ message: `Request ${newRequest.id} from user ${user_id}: @ ${datetime} created successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error from API', error });
  }

  console.log('📞| Fin del mensaje a /requests');
  return null;
};

const createRequestToWebpay = async (req, res) => {
  console.log('📠| POST request recibida a /requests/webpay en API');

  try {
    const request = req.body;

    if (!request) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const {
      user_id, group_id, symbol, datetime, deposit_token, quantity, seller,
    } = request;

    if (!user_id
      || !group_id
      || !symbol
      || !datetime
      || deposit_token !== ''
      || !quantity
      || seller === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: `User ${user_id} not found` });
    }
    const lastStock = await Stock.findOne({
      where: { symbol },
      order: [['createdAt', 'DESC']],
    });
    if (!lastStock) {
      return res.status(404).json({ message: `Stock ${symbol} not found` });
    }

    const location = await user.processUserLocation(req);
    console.log(`📍 | User ${user.username} sent a buy request from ${location}`);

    const newRequest = await Request.create({
      user_id,
      stock_id: lastStock.id,
      group_id,
      symbol,
      datetime,
      deposit_token,
      quantity,
      seller,
      location,
    });

    const newTransaction = await Transaction.create({
      user_id,
      request_id: newRequest.id,
      stock_symbol: symbol,
      quantity,
      amount: lastStock.price * quantity,
    });

    const redirect_url = process.env.WEBPAY_REDIRECT_URL ? `${process.env.WEBPAY_REDIRECT_URL}/${symbol}` : 'http://localhost:8080';

    const trx = await tx.create(newTransaction.id, 'grupo-19-stocks', newTransaction.amount, redirect_url);

    await db.transaction.update({
      where: {
        id: newTransaction.id,
      },
      data: {
        token: trx.token,
      },
    });

    res.body = trx;
    return res.status(201).json({ message: `Transaction ${newTransaction.id} from user ${user_id}: waiting payment` });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error from API', error });
  }

  console.log('📞| Fin del mensaje a /requests/webpay');
  return null;
};

const commitRequestToWebpay = async (req, res) => {
  const { token_ws } = req.body;
  if (!token_ws || token_ws === '') {
    return res.status(200).json({ message: 'Transaccion anulada por el usuario' });
  }
  const confirmedTx = await tx.commit(token_ws);

  if (confirmedTx.response_code !== 0) { // Rechaza la compra
    await db.transaction.update({
      where: {
        token: token_ws,
      },
      data: {
        status: 'rejected',
      },
    });

    return res.status(200).json({ message: 'Transaccion ha sido rechazada' });
  }

  await db.transaction.update({
    where: {
      token: token_ws,
    },
    data: {
      status: 'filled',
    },
  });

  return res.status(200).json({ message: 'Transaccion ha sido aceptada' });
};

const updateRequestStatus = async (req, res) => {
  console.log('📠| POST request recibida a /updateRequestStatus en API');
  console.log(req.body);
  res.status(200).json({ message: 'Request status updated successfully' });
};

module.exports = {
  getRequests,
  postRequests,
  updateRequestStatus,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller,
  createRequestToWebpay,
  commitRequestToWebpay,
};
