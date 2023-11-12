const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Tutorial extends BaseModel {
  static association() {}
}

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
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  published: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
  },
  del: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    default: 0,
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

Tutorial.init(attributes, { ...options, sequelize });

module.exports = Tutorial;

// module.exports = (sequelize, Sequelize) => {
//   return sequelize.define("tutorial", {
//     title: {
//       type: Sequelize.STRING,
//     },
//     description: {
//       type: Sequelize.STRING,
//     },
//     published: {
//       type: Sequelize.BOOLEAN,
//     },
//   });
// };
