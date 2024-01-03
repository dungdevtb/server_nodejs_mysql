const { UserController, CustomerController } = require("../controllers");
const { Router } = require("express");
const { Response, ResponseExportExcel } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_NGUOI_DUNG, QUAN_LY_ADMIN } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/list-user", check_permission(QUAN_LY_ADMIN), ResponseExportExcel(UserController.exportListUser));
svRouter.get("/list-customer", check_permission(QUAN_LY_NGUOI_DUNG), ResponseExportExcel(CustomerController.exportListCustomer));

module.exports = svRouter;