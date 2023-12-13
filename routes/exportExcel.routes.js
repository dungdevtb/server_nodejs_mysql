const { UserController } = require("../controllers");
const { Router } = require("express");
const { Response, ResponseExportExcel } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_NGUOI_DUNG } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/list-user", check_permission(QUAN_LY_NGUOI_DUNG), ResponseExportExcel(UserController.exportListUser));

module.exports = svRouter;