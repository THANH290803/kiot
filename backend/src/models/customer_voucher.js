module.exports = (sequelize, DataTypes) => {
  const CustomerVoucher = sequelize.define(
    "CustomerVoucher",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      voucher_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "available",
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expired_at: {
        type: DataTypes.DATE,
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
      tableName: "customer_vouchers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  CustomerVoucher.associate = (models) => {
    CustomerVoucher.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });
    CustomerVoucher.belongsTo(models.Voucher, {
      foreignKey: "voucher_id",
      as: "voucher",
    });
    CustomerVoucher.hasMany(models.Order, {
      foreignKey: "customer_voucher_id",
      as: "orders",
    });
  };

  return CustomerVoucher;
};
