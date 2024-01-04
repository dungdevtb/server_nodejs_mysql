const { sequelize } = require('../config/connect');
const BaseModel = require('./BaseModel');
const { DataTypes } = require('sequelize');
/**
 * Define CustomerCollection Model
 *
 * @export
 * @class CustomerCollection
 * @extends {BaseModel}
 */
class CustomerCollection extends BaseModel {
    static association() {
        const Customer = require('./customer.model');
        const Admin = require('./user.model');
        const Voucher = require('./voucher.model');

        this.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
        this.belongsTo(Admin, { foreignKey: 'admin_id_send', as: 'admin' });
        this.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
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
    customer_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    admin_id_send: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    // nguồn
    source: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    voucher_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    // mô tả
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    image: {
        type: DataTypes.STRING(512),
        allowNull: true,
        defaultValue: null
    },
    // hạn dùng
    expired_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    // tên ưu đãi
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    // like
    like: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null
    },
    // ngày bắt đầu
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    status: { // 0 tạo mới, 1 đã sử dụng, 
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null
    },
    del: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
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
    tableName: 'customer_collection'
};

/**
 * Init Model
 */
CustomerCollection.init(attributes, { ...options, sequelize });

module.exports = CustomerCollection;