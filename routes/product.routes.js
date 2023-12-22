// var router = require("express").Router();
const { ProductController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_SAN_PHAM } = require("../middleware/actionDefault");

const svRouter = new Router();

// svRouter.get("/get_all_products", check_permission(QUAN_LY_SAN_PHAM), Response(ProductController.getAllProducts));
svRouter.get("/get_all_products", Response(ProductController.getAllProducts));

svRouter.get("/get_product/:id", check_permission(QUAN_LY_SAN_PHAM), Response(ProductController.getProductById));

svRouter.post(
  "/create_update_product",
  // check_permission(QUAN_LY_SAN_PHAM),
  Response(ProductController.createUpdateProduct)
);

svRouter.post("/delete_product/:id", check_permission(QUAN_LY_SAN_PHAM), Response(ProductController.deleteProduct));

module.exports = svRouter;
