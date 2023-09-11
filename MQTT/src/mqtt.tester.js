require('dotenv').config();
const axios = require('axios');

console.log("importé el módulo")

const my_dictionary = {
  request_id: '63fe8daa-4f94-11ee-be56-0242ac120002',
  group_id: '13',
  symbol: "AAPL",
  datetime: new Date(),
  deposit_token: '',
  quantity: 1,
  seller: 0
}

console.log("variable definida")

function publishDataMQTT(client) {
  console.log("entrando a función")
  client.publish(process.env.REQUESTS_CHANNEL,
    JSON.stringify(my_dictionary))
  console.log("su publish loco")
}

module.exports = {
  publishDataMQTT
}
