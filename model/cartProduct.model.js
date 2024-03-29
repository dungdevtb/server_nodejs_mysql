const { sequelize } = require("../config/db.config");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class CartProduct extends BaseModel {
    static association() {
        const Product = require("./product.model");
        this.belongsTo(Product, {
            foreignKey: "product_id",
            as: "product",
            targetKey: "id",
        })

        const Size = require("./size.model");
        this.belongsTo(Size, {
            foreignKey: "size_id",
            as: "size",
            targetKey: "id",
        })

        const Color = require("./color.model");
        this.belongsTo(Color, {
            foreignKey: "color_id",
            as: "color",
            targetKey: "id",
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
    product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
    cart_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    size_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    color_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    quantity: {
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
    }
}

const options = {
    tableName: "cart_product",
}

CartProduct.init(attributes, { ...options, sequelize });

module.exports = CartProduct;