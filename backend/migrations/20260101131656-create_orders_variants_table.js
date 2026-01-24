'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      order_code: {
        type: Sequelize.STRING(50),
        unique: true,
      },

      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "customers",
          key: "id",
        },
      },

      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },

      total_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      // Tổng tiền đơn hàng
      total_amount: {
        type: Sequelize.INTEGER, // int như bạn đang dùng
        defaultValue: 0,
      },

      // ===== PAYMENT =====

      payment_method: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "cash",
        comment: "cash | bank_transfer | momo | vnpay | card",
      },

      // ===== ORDER STATUS =====
      status: {
        type: Sequelize.STRING(30),
        defaultValue: "pending",
        comment: "pending | completed | cancelled",
      },

      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // ===== SOFT DELETE =====
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      // ===== TIMESTAMP =====
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  }
};
