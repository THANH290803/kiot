module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define(
        "Image",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            variant_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            url: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            is_primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            sort_order: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "images",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
        }
    );

    Image.associate = (models) => {
        Image.belongsTo(models.ProductVariant, {
            foreignKey: "variant_id",
            as: "variant",
        });
    };

    return Image;
};