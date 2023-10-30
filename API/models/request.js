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
      request.belongsTo(models.user, { foreignKey: 'user_id' });
      request.belongsTo(models.stock, { foreignKey: 'stock_id' });
      request.hasOne(models.validation, { foreignKey: 'request_id' });
      request.hasOne(models.transaction, { foreignKey: 'request_id' });
    }
  }
  request.init({
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
    stock_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Stock ID cannot be empty',
        },
        notNull: {
          msg: 'Stock ID cannot be null',
        },
      },
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Group ID cannot be empty',
        },
        notNull: {
          msg: 'Group ID cannot be null',
        },
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Symbol cannot be empty',
        },
      },
    },
    datetime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Datetime cannot be empty',
        },
        notNull: {
          msg: 'Datetime cannot be null',
        },
      },
    },
    deposit_token: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
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
    seller: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'seller must be an integer',
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
          args: [['pending', 'filled', 'cancelled']],
          msg: 'status must be one of the following: pending, filled, cancelled',
        },
      },
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: 'Unknown',
      allowNull: false,
    },
    total_price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'total_price must be an integer',
        },
      },
    },
    receipt_url: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'request',
  });
  return request;
};
