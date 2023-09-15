require('dotenv').config()
const express = require('express')
const stockRoutes = require('./routes/stock.routes')
const userRoutes = require('./routes/user.routes')
const validationRoutes = require('./routes/validation.routes')
const requestRoutes = require('./routes/request.routes')
const sequelize = require('./db/db')

const app = express()

const syncDatabase = async () => {
  try {
    await sequelize.sync({alter: true})
    console.log('😄| Conexión a la base de datos exitosa.');
    
  } catch (error) {
    console.log('😡| No se pudo conectar a la base de datos.')
    console.error(error)
    process.exit(1)
  }
}

syncDatabase()

app.use(express.json())
app.use('/stocks', stockRoutes)
app.use('/users', userRoutes)
app.use('/validations', validationRoutes)
app.use('/requests', requestRoutes)

module.exports = app

