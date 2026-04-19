'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "customer_voucher_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "customer_vouchers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      after: "customer_id",
    });

    await queryInterface.addIndex("orders", ["customer_voucher_id"]);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("orders", "customer_voucher_id");
  },
};
