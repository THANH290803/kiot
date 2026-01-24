'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // Gắn cho biến thể (màu / size)
      variant_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "product_variants",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      // Đường dẫn ảnh
      url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      // Ảnh chính hay không
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      // ===== SOFT DELETE =====
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("images");
  }
};
