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
class PostTag extends BaseModel {
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
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    tableName: 'post_tag',
};

/**
 * Init Model
 */
PostTag.init(attributes, { ...options, sequelize });

module.exports = PostTag;
