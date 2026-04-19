'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'channel', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'in_store',
      comment: 'online | in_store',
      after: 'payment_method',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'channel');
  },
};
