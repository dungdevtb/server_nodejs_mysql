const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Product extends BaseModel {
  static association() {
    const Category = require("./category.model");
    this.belongsTo(Category, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}

const attributes = {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
  },
  category_id: {
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
  tableName: "product",
};

Product.init(attributes, { ...options, sequelize });

module.exports = Product;
