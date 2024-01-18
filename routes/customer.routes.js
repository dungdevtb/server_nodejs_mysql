const { CustomerController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission, isAuthAdmin, checkToken } = require("../middleware/auth");
const { QUAN_LY_NGUOI_DUNG } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.post("/login", Response(CustomerController.login));
svRouter.post("/register", Response(CustomerController.register));
// svRouter.get("/login-by-token", isAuthAdmin, Response(CustomerController.getProfile));

svRouter.get("/get-list-customer", check_permission(QUAN_LY_NGUOI_DUNG), Response(CustomerController.getListCustomer));
svRouter.post("/update-customer", check_permission(QUAN_LY_NGUOI_DUNG), Response(CustomerController.updateCustomer));
svRouter.post("/delete-customer", check_permission(QUAN_LY_NGUOI_DUNG), Response(CustomerController.deleteCustomer));

svRouter.post("/create-comment",
    // checkToken, 
    Response(CustomerController.createComment));

module.exports = svRouter