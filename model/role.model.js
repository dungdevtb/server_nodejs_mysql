const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Role extends BaseModel {
  static association() {
    // const UserRole = require("./userRole.model");
    // this.hasMany(UserRole, {
    //   foreignKey: "role_id",
    //   as: "user_role",
    // });

    const RolePermission = require("./rolePermission.model");
    this.hasMany(RolePermission, {
      foreignKey: "role_id",
      as: "role_permission",
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
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
  tableName: "role",
};

Role.init(attributes, { ...options, sequelize });

module.exports = Role;
