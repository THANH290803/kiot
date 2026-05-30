"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "is_two_factor_enabled", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("users", "two_factor_enabled_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.createTable("user_otp_codes", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "login_2fa | enable_2fa | disable_2fa",
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      used_at: {
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("user_otp_codes", ["user_id", "type"]);
    await queryInterface.addIndex("user_otp_codes", ["expires_at"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_otp_codes");
    await queryInterface.removeColumn("users", "two_factor_enabled_at");
    await queryInterface.removeColumn("users", "is_two_factor_enabled");
  },
};
