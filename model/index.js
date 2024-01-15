const Tutorial = require("./tutorial.model");
const Product = require("./product.model");
const Category = require("./category.model");
const User = require("./user.model");
const Role = require("./role.model");
const UserRole = require("./userRole.model");
const RefreshToken = require("./refreshToken.model");
const Crawl = require("./crawl.model");
const Permission = require("./permission.model");
const RolePermission = require("./rolePermission.model");
const Brand = require("./brand.model")
const Size = require("./size.model")
const SizeColor = require("./sizeColor.model")
const Color = require("./color.model")
const Customer = require("./customer.model")
const Order = require("./order.model")
const OrderProduct = require("./orderProduct.model")
const Voucher = require("./voucher.model")
const VoucherProduct = require("./voucherProduct.model")
const Post = require("./post.model");
const PostCategory = require("./postCategory.model");
const PostTag = require("./postTag.model");
const PostHookTag = require("./postHookTag.model");
const Cart = require("./cart.model")
const CartProduct = require("./cartProduct.model")

// Tutorial.sync(); //create table
// Product.sync();
// Category.sync();
// User.sync();
// Role.sync();
// UserRole.sync();
// RefreshToken.sync();
// Crawl.sync();
const { sequelize } = require("../config/db.config"); //call connect

// new createTable
for (const m in sequelize.models) {
  sequelize.models[m].sync();
}

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
  Permission,
  RolePermission,
  Brand,
  Size,
  SizeColor,
  Color,
  Customer,
  Order,
  OrderProduct,
  Voucher,
  VoucherProduct,
  Post,
  PostCategory,
  PostTag,
  PostHookTag,
  Cart,
  CartProduct
};
