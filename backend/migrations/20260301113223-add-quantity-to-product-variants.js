'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
        "product_variants",
        "quantity",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: "Số lượng tồn kho",
        }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
        "product_variants",
        "quantity"
    );
  }
};
