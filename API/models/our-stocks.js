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
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ourStocks',
  });
  return ourStocks;
};
