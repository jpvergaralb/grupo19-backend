const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ourStocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  ourStocks.init({
    stock_symbol: {
      type: DataTypes.STRING,
    },
    stock_name: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.FLOAT,
    },
  }, {
    sequelize,
    modelName: 'ourStocks',
  });
  return ourStocks;
};
