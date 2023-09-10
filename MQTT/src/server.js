require('dotenv').config()
const express = require('express')
const { client }  = require('./config/mqtt.config')
const mqttHandler = require('./mqtt.handler')

const app = express()

mqttHandler(client)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(process.env.MQTT_PORT, () => {
    console.log(`Server running on port ${process.env.MQTT_PORT}`)
})
