const { RoleController } = require("../controllers")
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_VAI_TRO } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/get-list-role", check_permission(QUAN_LY_VAI_TRO), Response(RoleController.getListRole))

svRouter.get("/get-role/:id", check_permission(QUAN_LY_VAI_TRO), Response(RoleController.getRoleById))

svRouter.post("/create-update-role", check_permission(QUAN_LY_VAI_TRO), Response(RoleController.createUpdateRole))

svRouter.post("/delete-role/:id", check_permission(QUAN_LY_VAI_TRO), Response(RoleController.deleteRole))

svRouter.post("/add-role-permission", check_permission(QUAN_LY_VAI_TRO), Response(RoleController.addRolePermission))

module.exports = svRouter




