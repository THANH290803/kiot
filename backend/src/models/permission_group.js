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

  return PermissionGroup;
};
