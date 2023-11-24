const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")
const BaseModel = require("./BaseModel")

class Crawl extends BaseModel {
    static association() { }
}

const attributes = {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    job: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    company: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    salary: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}

const options = {
    tableName: "crawl",
}

Crawl.init(attributes, { ...options, sequelize })

module.exports = Crawl