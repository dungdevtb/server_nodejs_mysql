// var router = require("express").Router();
const { CategoryController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");

const svRouter = new Router();

svRouter.get(
  "/get_all_categorys",
  Response(CategoryController.getAllCategorys)
);

svRouter.get("/get_category/:id", Response(CategoryController.getCategoryById));

svRouter.post(
  "/create_update_category",
  Response(CategoryController.createUpdateCategory)
);

svRouter.post(
  "/delete_category/:id",
  Response(CategoryController.deleteCategory)
);

module.exports = svRouter;
