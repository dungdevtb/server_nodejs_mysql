// var router = require("express").Router();
const { ProductController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");

const svRouter = new Router();

svRouter.get("/get_all_products", Response(ProductController.getAllProducts));

svRouter.get("/get_product/:id", Response(ProductController.getProductById));

svRouter.post(
  "/create_update_product",
  Response(ProductController.createUpdateProduct)
);

svRouter.post("/delete_product/:id", Response(ProductController.deleteProduct));

module.exports = svRouter;
