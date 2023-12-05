// var router = require("express").Router();
const { ProductController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken } = require("../middleware/validateTokenHandler");

const svRouter = new Router();

svRouter.get("/get_all_products", checkToken, Response(ProductController.getAllProducts));

svRouter.get("/get_product/:id", checkToken, Response(ProductController.getProductById));

svRouter.post(
  "/create_update_product",
  checkToken,
  Response(ProductController.createUpdateProduct)
);

svRouter.post("/delete_product/:id", checkToken, Response(ProductController.deleteProduct));

module.exports = svRouter;
