module.exports = (sequelize, DataTypes) => {
  const PermissionGroup = sequelize.define(
    "PermissionGroup",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "permission_groups",
      timestamps: false,
    }
  );

  // ✅ ĐÚNG CHỖ
  PermissionGroup.associate = (models) => {
    PermissionGroup.hasMany(models.Permission, {
      foreignKey: "group_id",
      as: "permissions",
    });
  };
  return PermissionGroup;
};
