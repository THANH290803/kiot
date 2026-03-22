'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "avatar", {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: "Ảnh đại diện sản phẩm",
    });

    await queryInterface.removeColumn("product_variants", "avatar");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("product_variants", "avatar", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.removeColumn("products", "avatar");
  },
};
