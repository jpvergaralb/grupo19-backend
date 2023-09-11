require('dotenv').config()
const express = require('express')
const { client }  = require('./connectors/mqtt.connector')
const mqttHandler = require('./handlers/mqtt.handler')
const rootRoutes = require('./routes/root.route')
const requestRoutes = require('./routes/request.route')
const { publishDataMQTT } = require('./testers/mqtt.test')

const app = express()

mqttHandler(client)


app.use(express.json())
app.use('/', rootRoutes)
app.use('/', requestRoutes)

app.listen(process.env.MQTT_API_PORT, () => {
    console.log(`▶️| Servidor MQTT Listener corriendo en puerto ${process.env.MQTT_API_PORT}`)
})

// Para testear la interacción con el broker MQTT
setTimeout(function() {
    publishDataMQTT(client);
}, 5000);

