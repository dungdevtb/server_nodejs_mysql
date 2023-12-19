const { sequelize } = require("../config/db.config");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class SizeColor extends BaseModel {
    static association() {
        const Size = require("./size.model");
        this.belongsTo(Size, {
            foreignKey: "size_id",
            as: "size",
        });

        const Color = require("./color.model");
        this.belongsTo(Color, {
            foreignKey: "color_id",
            as: "color",
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
    size_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
    },
    color_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
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
    }
}

const options = {
    tableName: "size_color",
}

SizeColor.init(attributes, { ...options, sequelize });

module.exports = SizeColor;