const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

class Request extends Model {}

Request.init(
  {
    request_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Request ID cannot be empty"
        },
        notNull: {
          msg: "Request ID cannot be null"
        },
        isUUID: {
          msg: "Request ID must be a UUID"
        }
      }
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Group ID cannot be empty"
        },
        notNull: {
          msg: "Group ID cannot be null"
        }
      }
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Symbol cannot be empty"
        }
      }
    },
    datetime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Datetime cannot be empty"
        },
        notNull: {
          msg: "Datetime cannot be null"
        }
      }
    },
    deposit_token: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
      validate: {
        isString: {
          msg: "Deposit token must be a string"
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "quantity cannot be empty"
        },
        notNull: {
          msg: "quantity cannot be null"
        },
        isInt: {
          msg: "quantity must be an integer"
        }
      }
    },
    seller: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: "seller must be an integer"
        }
      }
    }
  },
  
  {
    sequelize,
    modelName: "Request",
    tableName: "requests",
    timestamps: true
  }
);

module.exports = Request;
