const { sequelize } = require("../config/db.config");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class OrderProduct extends BaseModel {
    static association() {
        const Order = require("./order.model");
        this.belongsTo(Order, {
            foreignKey: "order_id",
            as: "order",
        });

        const Product = require("./product.model");
        this.belongsTo(Product, {
            foreignKey: "product_id",
            as: "product",
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
    order_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
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
    tableName: "order_product",
}

OrderProduct.init(attributes, { ...options, sequelize });

module.exports = OrderProduct;