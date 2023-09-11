require('dotenv').config();
const { newUUID, randInt } = require('../utils/random');

const my_dictionary = {
  request_id: newUUID(),
  group_id: `${process.env.GROUP_NUMBER}`,
  symbol: "AAPL",
  datetime: new Date(),
  deposit_token: '',
  quantity: randInt(1, 10),
  seller: 0
}

function publishDataMQTT(client) {
  console.log("🧪| Testeando publicación de datos al broker MQTT...");
  client.publish(process.env.MQTT_API_REQUEST_CHANNEL,
    JSON.stringify(my_dictionary))
  console.log("🧑‍🔬️| Publicación de datos al broker MQTT finalizada...");
}

module.exports = {
  publishDataMQTT
}
