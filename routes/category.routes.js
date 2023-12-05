// var router = require("express").Router();
const { CategoryController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken } = require("../middleware/validateTokenHandler");
const svRouter = new Router();

svRouter.get(
  "/get_all_categorys",
  checkToken,
  Response(CategoryController.getAllCategorys)
);

svRouter.get("/get_category/:id", checkToken, Response(CategoryController.getCategoryById));

svRouter.post(
  "/create_update_category",
  checkToken,
  Response(CategoryController.createUpdateCategory)
);

svRouter.post(
  "/delete_category/:id",
  checkToken,
  Response(CategoryController.deleteCategory)
);

module.exports = svRouter;
