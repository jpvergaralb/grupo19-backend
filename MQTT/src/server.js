require('dotenv').config()
const express = require('express')
const { client }  = require('./config/mqtt.config')
const mqttHandler = require('./mqtt.handler')

// const { publishDataMQTT } = require('./mqtt.tester')

const app = express()

mqttHandler(client)

app.get('/', (req, res) => {
    res.send('MQTT Server API (backend)')
})

app.listen(process.env.MQTT_PORT, () => {
    console.log(`▶️ | Servidor MQTT Listener corriendo en puerto ${process.env.MQTT_PORT}`)
})

//// Para testear la interacción con el broke MQTT
// setTimeout(function() {
//     publishDataMQTT(client);
// }, 5000);

