'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("customer_vouchers", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      voucher_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "vouchers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "available",
        comment: "available | used | expired",
      },

      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex("customer_vouchers", ["customer_id"]);
    await queryInterface.addIndex("customer_vouchers", ["voucher_id"]);
    await queryInterface.addIndex("customer_vouchers", ["customer_id", "status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("customer_vouchers");
  },
};
