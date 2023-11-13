const Tutorial = require("./tutorial.model");
const Product = require("./product.model");
const Category = require("./category.model");

Tutorial.sync(); //create table
Product.sync();
Category.sync();

const { sequelize } = require("../config/db.config"); //call connect
for (const m in sequelize.models) {
  sequelize.models[m].association();
}

module.exports = {
  Tutorial,
  Product,
  Category,
};
