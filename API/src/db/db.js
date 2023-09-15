// campos: nombre, precio, fecha, simbolo, divisa, ... (ver en el archivo)
require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('../config/db.config');

const env = process.env.NODE_ENVIRONMENT || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

module.exports = sequelize;
