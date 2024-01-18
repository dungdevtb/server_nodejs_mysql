const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Comment extends BaseModel {
    static association() {
        const Customer = require("./customer.model");
        this.belongsTo(Customer, {
            foreignKey: "customer_id",
            as: "customer",
        })

        const Product = require("./product.model");
        this.belongsTo(Product, {
            foreignKey: "product_id",
            as: "product",
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
        allowNull: true,
        defaultValue: null
    },
    customer_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    comment_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    rating: {
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
    tableName: "comment",
};

Comment.init(attributes, { ...options, sequelize });

module.exports = Comment;
