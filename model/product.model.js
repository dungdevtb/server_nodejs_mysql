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

    const Brand = require("./brand.model");
    this.belongsTo(Brand, {
      foreignKey: "brand_id",
      as: "brand",
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
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  import_price: {
    type: DataTypes.INTEGER(10),
    allowNull: true,
  },
  sell_price: {
    type: DataTypes.INTEGER(10),
    allowNull: true,
  },
  color: {
    type: DataTypes.TEXT,
    allowNull: true,
    get: function () {
      return Product.parseArr(this.getDataValue('color'));
    },
    set: function (val) {
      this.setDataValue('color', Product.setArr(val));
    }
  },
  size_quantity: {
    type: DataTypes.TEXT,
    allowNull: true,
    get: function () {
      return Product.parseArr(this.getDataValue('size_quantity'));
    },
    set: function (val) {
      this.setDataValue('size_quantity', Product.setArr(val));
    }
  },
  category_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
  },
  brand_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT(1),
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
