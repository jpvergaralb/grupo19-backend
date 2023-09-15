const sequelize = require('./db')

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

module.exports = syncDatabase