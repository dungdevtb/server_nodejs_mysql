const { PermissionController } = require("../controllers")
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken, check_permission } = require("../middleware/auth");
const { QUAN_LY_QUYEN, QUAN_LY_VAI_TRO } = require("../middleware/actionDefault");
const svRouter = new Router();

svRouter.get("/get-list-permission", check_permission(QUAN_LY_QUYEN), Response(PermissionController.getListPermissions))

svRouter.get("/get-permission/:id", check_permission(QUAN_LY_QUYEN), Response(PermissionController.getPermissionById))

svRouter.post("/create-update-permission", check_permission(QUAN_LY_QUYEN), Response(PermissionController.createUpdatePermission))

svRouter.post("/delete-permission/:id", check_permission(QUAN_LY_QUYEN), Response(PermissionController.deletePermission))

module.exports = svRouter




