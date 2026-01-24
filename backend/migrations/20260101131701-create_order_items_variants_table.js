'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },

      variant_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "product_variants",
          key: "id",
        },
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      // Giá bán tại thời điểm mua (VNĐ)
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Đơn giá sản phẩm tại thời điểm đặt hàng",
      },

      // Thành tiền = price * quantity
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Thành tiền = đơn giá x số lượng",
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
    await queryInterface.dropTable("order_items");
  }
};
