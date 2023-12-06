// var router = require("express").Router();
const { CategoryController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_DANH_MUC } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get(
  "/get_all_categorys",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getAllCategorys)
);

svRouter.get("/get_category/:id", check_permission(QUAN_LY_DANH_MUC), Response(CategoryController.getCategoryById));

svRouter.post(
  "/create_update_category",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.createUpdateCategory)
);

svRouter.post(
  "/delete_category/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.deleteCategory)
);

module.exports = svRouter;
