const axios = require('axios')

const postMQTT = async (path, data) => {
  try {
    const url = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_API_HOST}:${process.env.MQTT_API_PORT}/${path}`
    console.log(`📮 | Posting to ${url}...`)
    const response = await axios.post(url, data)
    return response
  } catch (error) {
    console.log(`🚨🚔 | ${error}`)
  }
}

module.exports = {
  postMQTT
}
