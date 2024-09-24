const { sequelize } = require("../config/db.config");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Guitar extends BaseModel {
    static association() {
        // const RolePermission = require("./rolePermission.model");
        // this.hasMany(RolePermission, {
        //     foreignKey: "permission_id",
        //     as: "role_permission",
        //     sourceKey: "id",
        // });
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
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    price: {
        type: DataTypes.INTEGER(10),
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
    }
}

const options = {
    tableName: "guitar",
}

Guitar.init(attributes, { ...options, sequelize });

module.exports = Guitar;

