'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // ===== MÃ NHÂN VIÊN =====
      employee_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      // ===== TÊN ĐĂNG NHẬP =====
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: "Tên đăng nhập hệ thống",
      },
      
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      phone_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true,
      },

      address: {
        type: Sequelize.STRING(225),
        allowNull: true,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      role_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      // ===== TRẠNG THÁI =====
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1, // 1: active, 0: inactive
        comment: "1: active, 0: inactive",
      },

      // ===== SOFT DELETE =====
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      // ===== TIMESTAMP =====
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  }
};
