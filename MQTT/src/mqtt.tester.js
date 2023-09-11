require('dotenv').config();
const axios = require('axios');

const my_dictionary = {
  request_id: '63fe8daa-4f94-11ee-be56-0242ac120002',
  group_id: '13',
  symbol: "AAPL",
  datetime: new Date(),
  deposit_token: '',
  quantity: 1,
  seller: 0
}

function publishDataMQTT(client) {
  client.publish(process.env.REQUESTS_CHANNEL,
    JSON.stringify(my_dictionary))
}

module.exports = {
  publishDataMQTT
}
