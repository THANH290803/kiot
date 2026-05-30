'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [constraints] = await queryInterface.sequelize.query(
      `
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'orders'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME = 'users'
      `
    );

    for (const row of constraints) {
      // Drop all FK constraints on orders.user_id -> users.id to avoid MySQL refusing column change.
      await queryInterface.removeConstraint('orders', row.CONSTRAINT_NAME);
    }

    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addConstraint('orders', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'orders_ibfk_2',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('orders', 'orders_ibfk_2');
    } catch (error) {
      // Ignore if constraint does not exist.
    }

    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.addConstraint('orders', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'orders_ibfk_2',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },
};
