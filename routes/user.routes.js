const { UserController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission, isAuthAdmin } = require("../middleware/auth");
const { QUAN_LY_NGUOI_DUNG, DOI_MAT_KHAU } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.post("/login", Response(UserController.login));

svRouter.post("/register", Response(UserController.register));
svRouter.get("/login-by-token", isAuthAdmin, Response(UserController.getProfile));
svRouter.post("/update_profile", isAuthAdmin, Response(UserController.updateProfile));
svRouter.post("/change_password", isAuthAdmin, Response(UserController.changePassword));

svRouter.get("/api/user/get-list-user", check_permission(QUAN_LY_NGUOI_DUNG), Response(UserController.getListUser));
svRouter.post("/api/user/update_user", check_permission(QUAN_LY_NGUOI_DUNG), Response(UserController.updateUser));

module.exports = svRouter;
