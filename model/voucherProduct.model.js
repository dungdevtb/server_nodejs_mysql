const { sequelize } = require("../config/connect");
const BaseModel = require('./BaseModel');
const { DataTypes } = require('sequelize');

/**
 * Define VoucherProduct Model
 * 
 * @export
 * @class VoucherProduct
 * @extends {BaseModel}
 */
class VoucherProduct extends BaseModel {
    static association() {
        const Voucher = require('./voucher.model');
        this.belongsTo(Voucher, {
            foreignKey: 'voucher_id',
            as: 'voucher'
        });
        const Product = require('./product.model');
        this.belongsTo(Product, {
            foreignKey: 'product_id',
            as: 'product'
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
    voucher_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    product_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
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
    tableName: 'voucher_product'
};

/**
 * Init Model
 */
VoucherProduct.init(attributes, { ...options, sequelize });

module.exports = VoucherProduct;