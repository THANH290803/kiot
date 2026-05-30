module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      order_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      customer_voucher_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      payment_method: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "cash",
      },
      channel: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "in_store",
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "pending",
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      paranoid: true, // Enable soft delete
      deletedAt: "deleted_at",
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });
    Order.belongsTo(models.CustomerVoucher, {
      foreignKey: "customer_voucher_id",
      as: "customerVoucher",
    });
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "orderItems",
    });
  };

  return Order;
};
