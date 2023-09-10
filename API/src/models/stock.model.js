const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

class Stock extends Model {}

Stock.init(
  {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Symbol cannot be empty"
        }
      }
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Short name cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: "Price must be a number"
        }
      }
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Currency cannot be empty"
        }
      }
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Source cannot be empty"
        }
      }
    }
  },
  {
    sequelize,
    modelName: "Stock",
    tableName: "stocks",
    timestamps: true
  }
)

module.exports = Stock;
