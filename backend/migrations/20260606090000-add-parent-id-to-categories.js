"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("categories", "parent_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      after: "description",
    });

    await queryInterface.addIndex("categories", ["parent_id"], {
      name: "idx_categories_parent_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("categories", "idx_categories_parent_id");
    await queryInterface.removeColumn("categories", "parent_id");
  },
};
