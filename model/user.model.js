const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class User extends BaseModel {
  static association() {
    const UserRole = require("./userRole.model");
    this.hasOne(UserRole, {
      foreignKey: "user_id",
      as: "user_role",
      targetKey: "id",
    });

    const RefreshToken = require("./refreshToken.model");
    this.hasOne(RefreshToken, {
      foreignKey: "user_id",
      targetKey: "id",
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
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    default: 0,
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
  tableName: "user",
};

User.init(attributes, { ...options, sequelize });

module.exports = User;
