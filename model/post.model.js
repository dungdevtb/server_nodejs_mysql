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
class Post extends BaseModel {
    static association() {
        const PostHookTag = require('./postHookTag.model')
        this.hasMany(PostHookTag, { foreignKey: 'post_id', sourceKey: 'id', as: 'tag' });
        const PostCategory = require('./postCategory.model')
        this.belongsTo(PostCategory, { foreignKey: 'category_id', as: 'postcategory' });
        const Admin = require('./user.model')
        this.belongsTo(Admin, { foreignKey: 'user_id' });
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
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    group_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        get: function () {
            return Post.parseObject(this.getDataValue('description'));
        },
        set: function (val) {
            this.setDataValue('description', Post.setObject(val));
        }
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
    },
    show_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    html_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    seo_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    seo_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    seo_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    del: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
    },
    hot: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
    },
    view: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
    },
    display_order: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        defaultValue: 1
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
    tableName: 'post',
};

/**
 * Init Model
 */
Post.init(attributes, { ...options, sequelize });

module.exports = Post;
