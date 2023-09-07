// campos: nombre, precio, fecha, simbolo, divisa, ... (ver en el archivo)
const { Sequelize } = require('sequelize');
const config = require('../config/db.config');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
  }
);

module.exports = sequelize;