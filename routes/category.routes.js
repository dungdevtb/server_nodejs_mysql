// var router = require("express").Router();
const { CategoryController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_DANH_MUC } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get(
  "/api/category/get_all_categorys",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getAllCategorys)
);

svRouter.get(
  "/api/category/get_category/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getCategoryById)
);

svRouter.post(
  "/api/category/create_update_category",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.createUpdateCategory)
);

svRouter.post(
  "/api/category/delete_category/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.deleteCategory)
);

svRouter.get(
  "/api/brand/get_list_brand",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getListBrand)
);

svRouter.get(
  "/api/brand/get_brand/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getBrandById)
);

svRouter.post(
  "/api/brand/create_update_brand",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.createUpdateBrand)
);

svRouter.post(
  "/api/brand/delete_brand/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.deleteBrand)
);

svRouter.get(
  "/api/product_type/get_list_product_type",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getListProductType)
);

svRouter.get(
  "/api/product_type/get_product_type/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.getProductTypeById)
);

svRouter.post(
  "/api/product_type/create_update_product_type",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.createUpdateProductType)
);

svRouter.post(
  "/api/product_type/delete_product_type/:id",
  check_permission(QUAN_LY_DANH_MUC),
  Response(CategoryController.deleteProductType)
);

module.exports = svRouter;
