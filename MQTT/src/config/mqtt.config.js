require('dotenv').config()

const url = 'mqtt://' + process.env.HOST + ':' + process.env.PORT
const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
}


module.exports = {
  url, options
}
