require('dotenv').config()

const url = 'mqtt://' + process.env.MQTT_BROKER_HOSTs + ':' + process.env.MQTT_BROKER_PORT
const options = {
  username: process.env.MQTT_BROKER_USERNAME,
  password: process.env.MQTT_BROKER_PASSWORD
}

module.exports = {
  url, options
}
