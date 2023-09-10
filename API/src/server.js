require('dotenv').config()
const express = require('express')
const stockRoutes = require('./routes/stock.routes')
const userRoutes = require('./routes/user.routes')
const validationRoutes = require('./routes/validation.routes')
const requestRoutes = require('./routes/request.routes')
const sequelize = require('./db/db')

const app = express()
const port = process.env.LOCAL_PORT || 8000

const syncDatabase = async () => {
  try {
    await sequelize.sync({alter: true})
    console.log('Connection has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

syncDatabase()

app.use(express.json())
app.use('/stocks', stockRoutes)
app.use('/users', userRoutes)
app.use('/validations', validationRoutes)
app.use('/requests', requestRoutes)

app.listen(port, () => {
  console.log(`Listening in port ${port}`)
})

