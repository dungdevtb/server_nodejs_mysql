const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Cart extends BaseModel {
  static association() {
    const Customer = require("./customer.model");
    this.belongsTo(Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });

    const OrderProduct = require("./orderProduct.model");
    this.hasMany(OrderProduct, {
      foreignKey: 'order_id',
      sourceKey: 'id',
      as: 'order_product'
    });

    const CartProduct = require("./cartProduct.model");
    this.hasMany(CartProduct, {
      foreignKey: 'cart_id',
      sourceKey: 'id',
      as: 'cart_product'
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
  customer_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    defaultValue: null
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
  tableName: "cart",
};

Cart.init(attributes, { ...options, sequelize });

module.exports = Cart;
