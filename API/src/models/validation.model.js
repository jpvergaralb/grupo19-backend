const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Validation extends Model {}

Validation.init(
  {
    request_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "request_id cannot be empty"
        }
      }
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "group_id cannot be empty"
        }
      }
    },
    seller: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "seller cannot be empty"
        },
        isInteger: {
          msg: "seller must be an integer"
        }
      }
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "valid cannot be empty"
        },
        isBoolean: {
          msg: "valid must be a boolean"
        }
      }
    }
  },
  {
    sequelize,
    modelName: "Validation",
    tableName: "validations",
    timestamps: true
  }
);

module.exports = Validation;
