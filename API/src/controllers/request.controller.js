const axios = require('axios');
const db = require('../../models');

const Request = db.request;
const User = db.user;
const Stock = db.stock;

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
    console.log("🐜🦗🦗🐜🦗🐜🐜🐝🐜🦗🐜🦗")
    console.log(request)

    // -----------------> VALIDACIONES DE INPUT <-----------------
    if (!request) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const {
      request_id, user_id, group_id, symbol, datetime, deposit_token, quantity, seller,
    } = request;

    if (!group_id
      || !symbol
      || !datetime
      || deposit_token === null
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

    if (request_id) {
      const didRequestExist = await Request.findOne({
        where: { id: request_id },
      });
      if (didRequestExist) {
        console.log(`🚨 | Request ${request_id} already exists from group ${group_id}`);
        return res.status(400).json({ message: `Request ${request_id} already exists from group ${group_id}` });
      }
    }
    // -----------------> FIN VALIDACIONES DE INPUT <-----------------

    const OUR_GROUP = '19';
    const MOCK_USER = "8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0"
    if (group_id != OUR_GROUP) {
      console.log(`❗ | Received a request from group ${group_id}`);
      const newRequest = await Request.create({
        id: request_id,
        user_id: MOCK_USER,
        stock_id: lastStock.id,
        group_id,
        symbol,
        datetime,
        deposit_token,
        quantity,
        seller,
        location: "unknown",
      });
      console.log(`😎🤯💰 | Request ${newRequest.id} (${request_id}) from group ${group_id}: @ ${datetime} created successfully`)
      return res.status(201).json({ message: `😎 | Request ${newRequest.id} (${request_id}) from group ${group_id}: @ ${datetime} created successfully` });
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
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error from API', error });
  }

  console.log('📞| Fin del mensaje a /requests');
  return null;
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
};
