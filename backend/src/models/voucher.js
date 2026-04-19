module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define(
    "Voucher",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      discount_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "percent",
      },
      discount_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      max_use: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      used_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "active",
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      tableName: "vouchers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  Voucher.associate = (models) => {
    Voucher.hasMany(models.CustomerVoucher, {
      foreignKey: "voucher_id",
      as: "customerVouchers",
    });
    Voucher.belongsToMany(models.Customer, {
      through: models.CustomerVoucher,
      foreignKey: "voucher_id",
      otherKey: "customer_id",
      as: "customers",
    });
  };

  return Voucher;
};
