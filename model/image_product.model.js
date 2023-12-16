const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class ImageProduct extends BaseModel {
    static association() {

    }
}

const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
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
    tableName: "image_product",
};

ImageProduct.init(attributes, { ...options, sequelize });

module.exports = ImageProduct;
