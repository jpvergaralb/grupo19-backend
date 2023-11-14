'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  proposal.init({
    auction_id: {
      type: DataTypes.UUIDV4
    },
    proposal_id: {
      type: DataTypes.UUID
    },
    stock_id: {
      type: DataTypes.UUID
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
          args: [['acceptance', 'rejection', 'proposal']],
          msg: 'status must be one of the following: proposal, rejection, acceptance',
        },
      }
    }
  }, {
    sequelize,
    modelName: 'proposal',
  });
  return proposal;
};