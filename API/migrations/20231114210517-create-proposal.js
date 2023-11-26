'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proposals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      auction_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      proposal_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      // es el symbol
      stock_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('proposals');
  }
};