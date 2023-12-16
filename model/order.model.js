const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Order extends BaseModel {
    static association() {
        // const Category = require("./category.model");
        // this.belongsTo(Category, {
        //   foreignKey: "category_id",
        //   as: "category",
        // });
    }
}

const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        default: 0,//đặt hàng , vận chuyển , hoàn thành ,hủy
    },
    metadata: {// lý do hủy
        type: DataTypes.TEXT,
        allowNull: true,
        get: function () {
            return Deposit.parseObject(this.getDataValue('metadata'));
        },
        set: function (val) {
            this.setDataValue('metadata', Deposit.setObject(val));
        }
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
    tableName: "order",
};

Order.init(attributes, { ...options, sequelize });

module.exports = Order;
