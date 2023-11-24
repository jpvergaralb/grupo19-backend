'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.user, { foreignKey: 'user_id' });
      transaction.belongsTo(models.request, { foreignKey: 'request_id' });
    }
  }
  transaction.init({
    id: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'User ID cannot be empty',
        },
        notNull: {
          msg: 'User ID cannot be null',
        },
      },
    },
    request_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Request ID cannot be empty',
        },
        notNull: {
          msg: 'Request ID cannot be null',
        },
      },
    },
    stock_symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Stock Symbol cannot be empty',
        },
        notNull: {
          msg: 'Stock Symbol cannot be null',
        },
      },
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'quantity cannot be empty',
        },
        notNull: {
          msg: 'quantity cannot be null',
        },
        isInt: {
          msg: 'quantity must be an integer',
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'amount cannot be empty',
        },
        notNull: {
          msg: 'amount cannot be null',
        },
        isFloat: {
          msg: 'amount must be an float',
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        notEmpty: {
          msg: 'status cannot be empty',
        },
        isIn: {
          args: [['pending', 'filled', 'rejected']],
          msg: 'status must be one of the following: pending, filled, rejected',
        },
      },
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};
