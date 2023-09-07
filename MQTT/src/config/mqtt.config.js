const mqtt = require('mqtt')
require('dotenv').config()

const url = 'mqtt://' + process.env.HOST + ':' + process.env.PORT 
const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
}
const client = mqtt.connect(url, options)

module.exports = { 
  client 
}