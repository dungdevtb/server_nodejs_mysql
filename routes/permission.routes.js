const { PermissionController } = require("../controllers")
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken } = require("../middleware/validateTokenHandler");

const svRouter = new Router();

svRouter.get("/get-list-permission", checkToken, Response(PermissionController.getListPermissions))

svRouter.get("/get-permission/:id", checkToken, Response(PermissionController.getPermissionById))

svRouter.post("/create-update-permission", checkToken, Response(PermissionController.createUpdatePermission))

svRouter.post("/delete-permission/:id", checkToken, Response(PermissionController.deletePermission))

module.exports = svRouter




