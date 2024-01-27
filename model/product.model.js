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

    const ProductType = require("./productType.model");
    this.belongsTo(ProductType, {
      foreignKey: "product_type_id",
      as: "product_type",
    });

    const Size = require("./size.model");
    this.hasMany(Size, {
      foreignKey: "product_id",
      as: "sizes",
    })

    const Color = require("./color.model");
    this.hasMany(Color, {
      foreignKey: "product_id",
      as: "colors",
    })

    const OrderProduct = require("./orderProduct.model");
    this.hasMany(OrderProduct, {
      foreignKey: 'product_id',
      sourceKey: 'id'
    });

    const CartProduct = require("./cartProduct.model");
    this.hasMany(CartProduct, {
      foreignKey: 'product_id',
      sourceKey: 'id'
    });

    const Comment = require("./comment.model");
    this.hasMany(Comment, {
      foreignKey: 'product_id',
      sourceKey: 'id',
      as: 'comments'
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
  discount: {
    type: DataTypes.FLOAT(10, 6),
    allowNull: true,
  },
  discount_price: {
    type: DataTypes.INTEGER(10),
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
  },
  brand_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
  },
  product_type_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 1
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
