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
    
    client.subscribe(process.env.VALIDATIONS_CHANNEL, (err) => {
      if (err) {
        console.log('Error subscribing to channel', err)
      }
    })
    
    client.subscribe(process.env.REQUESTS_CHANNEL, (err) => {
      if (err) {
        console.log('Error subscribing to channel', err)
      }
    })
  })

  client.on('message', async (topic, message) => {
    const msg = message.toString()
    
    let url = ""
    let data = {message: ""}
    
    
    if (topic === process.env.CHANNEL) {
      url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.LOCAL_PORT}/stocks`
      data = {
        message: msg
      }
    } else if (topic === process.env.VALIDATIONS_CHANNEL) {
      url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.LOCAL_PORT}/validations`
      data = {
        message: msg
      }
    } else if (topic === process.env.REQUESTS_CHANNEL) {
      url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.LOCAL_PORT}/requests`
      data = {
        message: msg
      }
    } else {
      console.log("F")
      console.log(topic)
    }
    

    try {
      const response = await axios.post(url, data)
      console.log(response.data)
  
    } catch (error) {
      console.log(error)
    }
  })
}
