require('dotenv').config()

const axios = require('axios')

module.exports = function (client) {
  client.on('error', (err) => {
    console.log('Error connecting to MQTT broker', err)
  })

  client.on('connect', () => {
    client.subscribe(process.env.CHANNEL, (err) => {
      if (err) {
        console.log('Error subscribing to channel', err)
      }
    })
  })

  client.on('message', async (topic, message) => {
    const msg = message.toString()
    const url = `http://${process.env.API_HOST}:${process.env.LOCAL_PORT}/stocks`
    const data = {
      message: msg
    }

    try {
      const response = await axios.post(url, data)
      console.log(response.data)
  
    } catch (error) {
      console.log(error)
    }
  })
}
