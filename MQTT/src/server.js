require('dotenv').config()
const express = require('express')
const { client }  = require('./connectors/mqtt.connector')
const mqttHandler = require('./handlers/mqtt.handler')

// const { publishDataMQTT } = require('./mqtt.testers')

const app = express()

mqttHandler(client)

app.get('/', (req, res) => {
    res.send('MQTT Server API (backend)')
})

app.listen(process.env.MQTT_PORT, () => {
    console.log(`▶️| Servidor MQTT Listener corriendo en puerto ${process.env.MQTT_PORT}`)
})



//// Para testear la interacción con el broker MQTT
// setTimeout(function() {
//     publishDataMQTT(client);
// }, 5000);

