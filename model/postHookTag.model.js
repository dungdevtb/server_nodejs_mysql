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
class PostHookTag extends BaseModel {
	static association() {
		const PostTag = require('./postTag.model')
		PostHookTag.belongsTo(PostTag, { as: 'tag', foreignKey: 'tag_id', targetKey: 'id' })
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
		autoIncrement: true,
	},
	post_id: {
		type: DataTypes.INTEGER(10).UNSIGNED,
		allowNull: false,
	},
	tag_id: {
		type: DataTypes.INTEGER(10).UNSIGNED,
		allowNull: false,
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
	tableName: 'post_hook_tag',
};

/**
 * Init Model
 */
PostHookTag.init(attributes, { ...options, sequelize });

module.exports = PostHookTag;
