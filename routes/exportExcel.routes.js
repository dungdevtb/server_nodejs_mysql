const {
    UserController,
    CustomerController,
    ProductController,
    OrderController
} = require("../controllers");
const { Router } = require("express");
const { ResponseExportExcel } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_NGUOI_DUNG, QUAN_LY_ADMIN, QUAN_LY_SAN_PHAM, QUAN_LY_DON_HANG } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/list-user", check_permission(QUAN_LY_ADMIN), ResponseExportExcel(UserController.exportListUser));
svRouter.get("/list-product", check_permission(QUAN_LY_SAN_PHAM), ResponseExportExcel(ProductController.exportExcelListProduct));
svRouter.get("/list-customer", check_permission(QUAN_LY_NGUOI_DUNG), ResponseExportExcel(CustomerController.exportListCustomer));
svRouter.get("/list-order", check_permission(QUAN_LY_DON_HANG), ResponseExportExcel(OrderController.exportListOrder));

module.exports = svRouter;