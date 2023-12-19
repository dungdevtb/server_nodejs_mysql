const { sequelize } = require("../config/db.config");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Color extends BaseModel {
    static association() {
        const SizeColor = require("./sizeColor.model");
        this.hasMany(SizeColor, {
            foreignKey: "color_id",
            sourceKey: "id",
            as: "size_color",
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
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    quantity: {
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
    }
}

const options = {
    tableName: "color",
}

Color.init(attributes, { ...options, sequelize });

module.exports = Color;

