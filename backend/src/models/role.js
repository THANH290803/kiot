module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
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
      tableName: "roles",
      timestamps: false,
      underscored: true,
    }
  );

  Role.associate = function (models) {
    Role.hasMany(models.User, { foreignKey: "role_id", as: "users" });

    // Many-to-Many: Role <-> Permission thông qua bảng pivot role_permissions
    Role.belongsToMany(models.Permission, {
      through: "role_permissions",
      foreignKey: "role_id",
      otherKey: "permission_id",
      as: "permissions",
    });
  };

  return Role;
};
