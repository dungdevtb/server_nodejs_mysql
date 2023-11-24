const Tutorial = require("./tutorial.model");
const Product = require("./product.model");
const Category = require("./category.model");
const User = require("./user.model");
const Role = require("./role.model");
const UserRole = require("./userRole.model");
const RefreshToken = require("./refreshToken.model");
const Crawl = require("./crawl.model");

Tutorial.sync(); //create table
Product.sync();
Category.sync();
User.sync();
Role.sync();
UserRole.sync();
RefreshToken.sync();
Crawl.sync();

const { sequelize } = require("../config/db.config"); //call connect
for (const m in sequelize.models) {
  sequelize.models[m].association();
}

module.exports = {
  Tutorial,
  Product,
  Category,
  User,
  Role,
  UserRole,
  RefreshToken,
  Crawl,
};
