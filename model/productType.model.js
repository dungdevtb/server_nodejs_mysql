const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class ProductType extends BaseModel {
    static association() {
        const Product = require("./product.model");
        this.hasMany(Product, {
            foreignKey: "product_type_id",
            as: "products",
        })
    }
}

const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    del: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
};

const options = {
    tableName: "product_type",
};

ProductType.init(attributes, { ...options, sequelize });

module.exports = ProductType;
