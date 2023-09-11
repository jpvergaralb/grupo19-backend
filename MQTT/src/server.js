require('dotenv').config()
const express = require('express')
const { client }  = require('./config/mqtt.config')
const mqttHandler = require('./mqtt.handler')

const { publishDataMQTT } = require('./mqtt.tester')

const app = express()

mqttHandler(client)

app.get('/', (req, res) => {
    res.send('MQTT Server API (backend)')
})

app.listen(process.env.MQTT_PORT, () => {
    console.log(`Server running on port ${process.env.MQTT_PORT}`)
})

// publishDataMQTT(client)

setTimeout(function() {
    publishDataMQTT(client);
}, 5000);

console.log("llegué al final")
