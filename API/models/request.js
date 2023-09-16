'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  request.init(
    {
      id: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        validate: {
          notEmpty: {
            msg: "status cannot be empty"
          },
          isIn: {
            args: [["pending", "filled", "cancelled"]],
            msg: "status must be one of the following: pending, filled, cancelled"
          }
        }
      }
    }, {
    sequelize,
    modelName: 'request',
  });
  return request;
};