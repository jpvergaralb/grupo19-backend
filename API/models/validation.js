'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class validation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      validation.belongsTo(models.request, { foreignKey: 'request_id'});
    }
  }
  validation.init(
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
          isInt: {
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
    }, {
    sequelize,
    modelName: 'validation',
  });
  return validation;
};