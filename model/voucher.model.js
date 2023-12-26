const { sequelize } = require("../config/connect");
const BaseModel = require('./BaseModel');
const { DataTypes } = require('sequelize');

/**
 * Define Voucher Model
 * 
 * @export
 * @class Voucher
 * @extends {BaseModel}
 */
class Voucher extends BaseModel {
    static association() {
        const Admin = require('./user.model');
        this.belongsTo(Admin, {
            foreignKey: 'user_id_created',
            targetKey: 'id'
        });
        const VoucherProduct = require('./voucherProduct.model');
        this.hasMany(VoucherProduct, {
            foreignKey: 'voucher_id',
            sourceKey: 'id', as: 'voucher_product'
        });
    }
}

/**
 * Attributes model
 */
const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type_voucher: {//0:voucher for order, 1:voucher for product
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    user_id_created: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    start: { // ngày bắt đầu
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    exp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(512),
        allowNull: true,
        defaultValue: 'percent',
        comment: 'percent: phần trăm, money: tiền'
    },
    max_money: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: true,
        defaultValue: null
    },
    percent: {
        type: DataTypes.FLOAT(10, 6),
        allowNull: true,
        defaultValue: null
    },
    // money_sale: {
    //     type: DataTypes.DECIMAL(20, 6),
    //     allowNull: true,
    //     defaultValue: null
    // },
    // min_checkout: {
    //     type: DataTypes.DECIMAL(20, 6),
    //     allowNull: true,
    //     defaultValue: null
    // },
    image: {
        type: DataTypes.STRING(512),
        allowNull: true,
        defaultValue: null
    },
    // số lượng được sử dụng
    used: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: 0
    },
    // tổng số vouchers
    total: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    // mô tả
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    html: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    html_obj: {
        type: DataTypes.TEXT,
        allowNull: true,
        get: function () {
            return Voucher.parseObject(this.getDataValue('html_obj'));
        },
        set: function (val) {
            this.setDataValue('html_obj', Voucher.setObject(val));
        }
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    // áp dụng tất cả sản phẩm
    all: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
        comment: '0: không, 1: có'
    },
    del: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
};

/**
 * Options model
 */
const options = {
    tableName: 'voucher'
};

/**
 * Init Model
 */
Voucher.init(attributes, { ...options, sequelize });

module.exports = Voucher;