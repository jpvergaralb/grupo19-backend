const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stocksOwners extends Model {
    /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
    static associate(models) {
      // define association here
      stocksOwners.belongsTo(models.user, { foreignKey: 'user_id' });
    }
  }
  stocksOwners.init({
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
    stock_symbol: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.FLOAT,
    },
  }, {
    sequelize,
    modelName: 'stocksOwners',
  });
  return stocksOwners;
};
