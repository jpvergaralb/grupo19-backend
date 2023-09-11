const mqtt = require('mqtt')
require('dotenv').config()
const { url, options } = require('../config/mqtt.config')

let client = null;

console.log("⌛ | Iniciando la conexión con el broker MQTT");

try {
  client = mqtt.connect(url, options)
  console.log("🤗 | Conexión exitosa con el broker MQTT");
  
} catch (error) {
  console.log("😭 | Conexión con broker falló")
  console.log(error)
  process.exit(1)
}

module.exports = {
  client
}
