'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vouchers", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      discount_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "percent",
        comment: "percent | fixed",
      },

      discount_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      max_use: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      used_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "active",
        comment: "active | inactive",
      },

      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vouchers");
  },
};
