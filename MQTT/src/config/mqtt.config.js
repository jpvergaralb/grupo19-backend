const mqtt = require('mqtt')
require('dotenv').config()

const url = 'mqtt://' + process.env.HOST + ':' + process.env.PORT
const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
}

let client = null;

try {
  client = mqtt.connect(url, options)
  console.log("connected!")
  
} catch (error) {
  console.log("not connected :'(")
  console.log(error)
  process.exit(1)
}

module.exports = {
  client
}
