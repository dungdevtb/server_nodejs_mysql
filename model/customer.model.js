const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Customer extends BaseModel {
  static association() {
    const Order = require("./order.model");
    this.hasMany(Order, {
      foreignKey: "customer_id",
      as: "orders",
    })

    // const Cart = require("./cart.model");
    // this.hasOne(Cart, {
    //   foreignKey: "customer_id",
    // })
  }
}

const attributes = {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // cart_id: {
  //   type: DataTypes.INTEGER(10).UNSIGNED,
  //   allowNull: true,
  //   defaultValue: null,
  // },
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
  tableName: "customer",
};

Customer.init(attributes, { ...options, sequelize });

module.exports = Customer;
