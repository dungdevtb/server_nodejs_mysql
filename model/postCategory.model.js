const { sequelize } = require("../config/connect");
const BaseModel = require('./BaseModel');
const { DataTypes } = require('sequelize');
/**
 * Define User Model
 *
 * @export
 * @class User
 * @extends {BaseModel}
 */
class PostCategory extends BaseModel {
    static association() { }
}

/**
 * Attributes model
 */
const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    del: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
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

/**
 * Options model
 */
const options = {
    tableName: 'post_category',
};

/**
 * Init Model
 */
PostCategory.init(attributes, { ...options, sequelize });

module.exports = PostCategory;
