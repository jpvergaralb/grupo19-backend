'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  offer.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    auction_id: {
      type: DataTypes.UUID
    },
    proposal_id: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: ["^$"],
          msg: 'proposal_id must be an empty string',
        },
      }
    },
    stock_id: {
      type: DataTypes.STRING,
    },
    quantity:{
      type: DataTypes.INTEGER
    },
    group_id: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['offer']],
          msg: 'status must be one of the following: offer',
        },
      }
    }
  }, {
    sequelize,
    modelName: 'offer',
  });
  return offer;
};