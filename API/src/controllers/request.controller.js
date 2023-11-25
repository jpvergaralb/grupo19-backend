const axios = require('axios');
const AWS = require('aws-sdk');
const db = require('../../models');
const tx = require('../../utils/trx');
const { addStocksToTheGroup, reduceStocksToTheGroup, addStocksToAUser } = require('../utils/groupStocksManipulation.util');

const Request = db.request;
const User = db.user;
const Stock = db.stock;
const MOCK_USER_UUID = '8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0';
const Transaction = db.transaction;
const GROUP_NUMBER = 19;
const OurStocks = db.ourStocks;

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
      request_id, user_id, group_id, symbol, datetime, deposit_token, quantity, seller,
    } = request;

    if (
      !group_id
      || !symbol
      || !datetime
      || deposit_token == ''
      || !quantity
      || seller === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const lastStock = await Stock.findOne({
      where: { symbol },
      order: [['createdAt', 'DESC']],
    });
    if (!lastStock) {
      return res.status(404).json({ message: `Stock ${symbol} not found` });
    }

    console.log(`🍷 | Received a request from group ${group_id} !`);
    if (group_id != GROUP_NUMBER) {
      console.log(`🍷🍷 | Request from another group received by group ${group_id} !`);
      if (
        !request_id
        || !group_id
        || !symbol
        || !datetime
        || deposit_token !== ''
        || !quantity
        || seller === undefined
      ) {
        await Request.create({
          id: request_id,
          user_id: MOCK_USER_UUID,
          stock_id: lastStock.id,
          group_id,
          symbol,
          datetime,
          deposit_token,
          quantity,
          seller,
          location: 'unknown',
        });
        console.log(`🚨🚔 | Request from another group created by group ${group_id} with id ${request_id}`);
        return res.status(201).json({ message: 'Request from another group created successfully' });
      }
      console.log(`🚨🚔 | Couldnt create request from another group created by group ${group_id} with id ${request_id}`);
      return res.status(400).json({ message: 'error' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: `User ${user_id} not found` });
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

const createRequestToWebpayAsUser = async (req, res) => {
  console.log('📠| POST request recibida a /requests/webpay/create en API');

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

    const availableStocks = await OurStocks.findOne({ where: { stock_symbol: symbol } });
    if (!availableStocks || availableStocks.quantity < quantity) {
      return res.status(404).json({ message: `Not enough stocks of ${symbol} available` });
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

    let precio_clp;

    await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_CONVERSION_KEY}/latest/USD`)
      .then((response) => {
        precio_clp = Math.ceil(response.data.conversion_rates.CLP * lastStock.price * quantity);
      });

    const newTransaction = await Transaction.create({
      user_id,
      request_id: newRequest.id,
      stock_symbol: symbol,
      quantity,
      amount: precio_clp,
    });

    const redirect_url = process.env.WEBPAY_REDIRECT_URL ? `${process.env.WEBPAY_REDIRECT_URL}` : 'http://localhost:8080';

    const trx = await tx.create(
      newTransaction.id.slice(0, 25),
      process.env.WEBPAY_SESSION_NAME,
      newTransaction.amount,
      redirect_url,
    );

    await Transaction.update({ token: trx.token }, {
      where: {
        id: newTransaction.id,
      },
    });

    await Request.update({
      deposit_token: trx.token,
      total_price: precio_clp,
    }, {
      where: {
        id: newRequest.id,
      },
    });

    // const requestMessage = {
    //   id: newRequest.id,
    //   stock_id: lastStock.id,
    //   group_id,
    //   symbol,
    //   datetime,
    //   deposit_token: trx.token,
    //   quantity,
    //   seller,
    // };

    // Llamado al broker para enviar el request
    // const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_REQUESTS_PATH}`;
    // console.log(`Posting to ${url}`);
    // await axios.post(url, requestMessage);

    const data = {
      token: trx.token,
      url: trx.url,
      precio_clp: newTransaction.amount,
    };

    res.status(201).json({ message: `Transaction ${newTransaction.id} from user ${user_id}: waiting payment`, transaction: data });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error from API', error });
    console.log(error);
  }

  console.log('📞| Fin del mensaje a /requests/webpay/create');
  return res;
};

const commitLock = {};

const commitRequestToWebpayAsUser = async (req, res) => {
  console.log('📠| POST request received at /requests/webpay/commit in API');
  const { token_ws } = req.body;
  if (!token_ws || token_ws === '') {
    return res.status(200).json({ message: 'Transaction canceled by the user' });
  }

  if (commitLock[token_ws]) {
    // If a previous transaction is still in progress, wait for it to finish.
    await commitLock[token_ws];
  }

  let message;
  let receipt_url;

  let user_id;
  let stock_symbol;
  let quantity;

  const transactionBeforeUpdate = await Transaction.findOne({ where: { token: token_ws } });
  const statusBeforeUpdate = transactionBeforeUpdate.status;

  const commitTransaction = async () => {
    const confirmedTx = await tx.commit(token_ws);

    if (confirmedTx.response_code !== 0) {
      // Reject the purchase
      await db.transaction.update({ status: 'rejected' }, {
        where: {
          token: token_ws,
        },
      });
      message = 'Transaction has been rejected';

      // const request = await Request.findOne({
      //   where: {
      //     deposit_token: token_ws,
      //   },
      // });

      // const validationBody = {
      //   request_id: request.id,
      //   group_id: request.group_id,
      //   seller: 0,
      //   valid: false,
      // };

      // Llamado al broker para enviar la validación
      // const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_VALIDATIONS_PATH}`;
      // console.log(`Posting to ${url}`);
      // await axios.post(url, validationBody);
    } else {
      // Accept the purchase
      await db.transaction.update({ status: 'filled' }, {
        where: {
          token: token_ws,
        },
      });
      message = 'Transaction has been accepted';

      const transaction = await Transaction.findOne({ where: { token: token_ws } });
      user_id = transaction.user_id;
      stock_symbol = transaction.stock_symbol;
      quantity = transaction.quantity;
      const total_price = transaction.amount;

      const request = await Request.findOne({
        where: {
          deposit_token: token_ws,
        },
      });

      const validationBody = {
        request_id: request.id,
        group_id: request.group_id,
        seller: 0,
        valid: true,
      };

      // // Llamado al broker para enviar la validación
      // const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_VALIDATIONS_PATH}`;
      // console.log(`Posting to ${url}`);
      // await axios.post(url, validationBody);

      // Llamado a la API para enviar la validación
      const urlApi = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/validations`;
      await axios.post(urlApi, validationBody);

      AWS.config.update({
        region: process.env.BUCKET_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_S3,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
      });

      const user = await User.findByPk(user_id);

      let lambdaPayload = {
        body: {
          'transaction-id': token_ws,
          'group-name': 19,
          'user-name': user.username,
          'user-email': user.email,
          symbol: stock_symbol,
          quantity,
          price: total_price,
        },
      };
      lambdaPayload = JSON.stringify(lambdaPayload);

      const lambda = new AWS.Lambda();
      const params = {
        FunctionName: process.env.PDF_LAMBDA_FUNCTION,
        Payload: lambdaPayload,
      };

      console.log('Intentando obtener url del pdf mediante lambda.');

      const lambdaResult = await lambda.invoke(params).promise();

      console.log(lambdaResult);

      const Payload = JSON.parse(lambdaResult.Payload);
      const Body = JSON.parse(Payload.body);

      receipt_url = Body.url;

      await Request.update({ receipt_url }, {
        where: { deposit_token: token_ws },
      });

      if (statusBeforeUpdate === 'pending') {
        const exito = await reduceStocksToTheGroup(stock_symbol, quantity);
        if (exito) {
          await addStocksToAUser(user_id, stock_symbol, quantity);
        } else {
          console.log('🚨🚔 | Couldnt add stocks to the user');
          return res.status(400).json({
            message: "Transaction completed but couldn't add the stocks to the user (you just got scammed)",
          });
        }
      }
    }
  };

  try {
    // Create a new Promise representing the ongoing transaction and store it in commitLock
    commitLock[token_ws] = commitTransaction();
    await commitLock[token_ws]; // Wait for the transaction to finish
    res.status(200).json({ message, receipt_url });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error from API', error });
  } finally {
    // Release the lock after the commit is done, whether it succeeds or fails.
    commitLock[token_ws] = null;
  }

  console.log('📞| End of request to /requests/webpay/commit');
  return res;
};

const updateRequestStatus = async (req, res) => {
  console.log('📠| POST request recibida a /updateRequestStatus en API');
  console.log(req.body);
  res.status(200).json({ message: 'Request status updated successfully' });
};

const createRequestToWebpayAsAdmin = async (req, res) => {
  console.log('📠| POST request recibida a /requests/webpay/admin/create en API');
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

    if (user.role !== 'admin') {
      return res.status(404).json({ message: 'User is not an admin' });
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

    let precio_clp;

    await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_CONVERSION_KEY}/latest/USD`)
      .then((response) => {
        precio_clp = Math.ceil(response.data.conversion_rates.CLP * lastStock.price * quantity);
      });

    const newTransaction = await Transaction.create({
      user_id,
      request_id: newRequest.id,
      stock_symbol: symbol,
      quantity,
      amount: precio_clp,
    });

    const redirect_url = process.env.WEBPAY_REDIRECT_URL ? `${process.env.WEBPAY_REDIRECT_URL}/admin` : 'http://localhost:8080';

    const trx = await tx.create(
      newTransaction.id.slice(0, 25),
      process.env.WEBPAY_SESSION_NAME,
      newTransaction.amount,
      redirect_url,
    );

    await Transaction.update({ token: trx.token }, {
      where: {
        id: newTransaction.id,
      },
    });

    await Request.update({
      deposit_token: trx.token,
      total_price: precio_clp,
    }, {
      where: {
        id: newRequest.id,
      },
    });

    const requestMessage = {
      id: newRequest.id,
      stock_id: lastStock.id,
      group_id,
      symbol,
      datetime,
      deposit_token: trx.token,
      quantity,
      seller,
    };

    // Llamado al broker para enviar el request
    const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_REQUESTS_PATH}`;
    console.log(`Posting to ${url}`);
    await axios.post(url, requestMessage);

    const data = {
      token: trx.token,
      url: trx.url,
      precio_clp: newTransaction.amount,
    };

    res.status(201).json({ message: `Transaction ${newTransaction.id} from user ${user_id}: waiting payment`, transaction: data });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error from API', error });
    console.log(error);
  }

  console.log('📞| Fin del mensaje a /requests/webpay/admin/create');
  return res;
};

const commitLockAdmin = {};

const commitRequestToWebpayAsAdmin = async (req, res) => {
  console.log('📠| POST request received at /requests/webpay/admin/commit in API');
  const { token_ws } = req.body;
  if (!token_ws || token_ws === '') {
    return res.status(200).json({ message: 'Transaction canceled by the user' });
  }

  if (commitLockAdmin[token_ws]) {
    // If a previous transaction is still in progress, wait for it to finish.
    await commitLockAdmin[token_ws];
  }

  let message;
  let receipt_url;

  let stock_symbol;
  let quantity;

  const transactionBeforeUpdate = await Transaction.findOne({ where: { token: token_ws } });
  const statusBeforeUpdate = transactionBeforeUpdate.status;

  const commitTransaction = async () => {
    const confirmedTx = await tx.commit(token_ws);

    if (confirmedTx.response_code !== 0) {
      // Reject the purchase
      await db.transaction.update({ status: 'rejected' }, {
        where: {
          token: token_ws,
        },
      });
      message = 'Transaction has been rejected';

      const request = await Request.findOne({
        where: {
          deposit_token: token_ws,
        },
      });

      const validationBody = {
        request_id: request.id,
        group_id: request.group_id,
        seller: 0,
        valid: false,
      };

      // Llamado al broker para enviar la validación
      const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_VALIDATIONS_PATH}`;
      console.log(`Posting to ${url}`);
      await axios.post(url, validationBody);
    } else {
      // Accept the purchase
      await db.transaction.update({ status: 'filled' }, {
        where: {
          token: token_ws,
        },
      });
      message = 'Transaction has been accepted';

      const transaction = await Transaction.findOne({ where: { token: token_ws } });
      stock_symbol = transaction.stock_symbol;
      quantity = transaction.quantity;

      const request = await Request.findOne({
        where: {
          deposit_token: token_ws,
        },
      });

      const validationBody = {
        request_id: request.id,
        group_id: request.group_id,
        seller: 0,
        valid: true,
      };

      // Llamado al broker para enviar la validación
      const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${process.env.MQTT_API_VALIDATIONS_PATH}`;
      console.log(`Posting to ${url}`);
      await axios.post(url, validationBody);

      AWS.config.update({
        region: process.env.BUCKET_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_S3,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
      });

      const user = await User.findByPk(request.user_id);

      let lambdaPayload = {
        body: {
          'transaction-id': token_ws,
          'group-name': 19,
          'user-name': user.username,
          'user-email': user.email,
          symbol: request.symbol,
          quantity: request.quantity,
          price: request.total_price,
        },
      };
      lambdaPayload = JSON.stringify(lambdaPayload);

      const lambda = new AWS.Lambda();
      const params = {
        FunctionName: process.env.PDF_LAMBDA_FUNCTION,
        Payload: lambdaPayload,
      };

      console.log('Intentando obtener url del pdf mediante lambda.');

      const lambdaResult = await lambda.invoke(params).promise();

      console.log(lambdaResult);

      const Payload = JSON.parse(lambdaResult.Payload);
      const Body = JSON.parse(Payload.body);

      receipt_url = Body.url;

      await Request.update({ receipt_url }, {
        where: { deposit_token: token_ws },
      });
    }

    if (statusBeforeUpdate === 'pending') {
      // Se guardan los stocks en la tabla del grupo
      await addStocksToTheGroup(stock_symbol, quantity);
    }
  };

  try {
    // Create a new Promise representing the ongoing transaction and store it in commitLockAdmin
    commitLockAdmin[token_ws] = commitTransaction();
    await commitLockAdmin[token_ws]; // Wait for the transaction to finish
    res.status(200).json({ message, receipt_url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error from API', error });
  } finally {
    // Release the lock after the commit is done, whether it succeeds or fails.
    commitLockAdmin[token_ws] = null;
  }

  console.log('📞| End of request to /requests/webpay/admin/commit');
  return res;
};

module.exports = {
  getRequests,
  postRequests,
  updateRequestStatus,
  getRequestsByGroupId,
  getRequestsBySymbol,
  getRequestsBySeller,
  createRequestToWebpayAsUser,
  commitRequestToWebpayAsUser,
  createRequestToWebpayAsAdmin,
  commitRequestToWebpayAsAdmin,
};
