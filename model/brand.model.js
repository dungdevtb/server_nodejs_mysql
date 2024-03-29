const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Brand extends BaseModel {
    static association() {
        const Product = require("./product.model");
        this.hasMany(Product, {
            foreignKey: "brand_id",
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
    tableName: "brand",
};

Brand.init(attributes, { ...options, sequelize });

module.exports = Brand;
