const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Size extends BaseModel {
  static association() {
    const Product = require("./product.model");
    this.belongsTo(Product, {
      foreignKey: "product_id",
      as: "product",
    });

    const SizeColor = require("./sizeColor.model");
    this.hasMany(SizeColor, {
      foreignKey: "size_id",
      as: "size_color",
      targetKey: "id",
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
  size: {
    type: DataTypes.INTEGER(10),
    allowNull: true,
  },
  product_id: {
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
  tableName: "size",
};

Size.init(attributes, { ...options, sequelize });

module.exports = Size;
