require('dotenv').config();

const my_dictionary = {
  request_id: '63fe8daa-4f94-11ee-be56-0242ac120002',
  group_id: `${process.env.GROUP_NUMBER}`,
  symbol: "AAPL",
  datetime: new Date(),
  deposit_token: '',
  quantity: 1,
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
