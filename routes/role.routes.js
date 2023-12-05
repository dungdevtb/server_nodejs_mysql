const { RoleController } = require("../controllers")
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken } = require("../middleware/validateTokenHandler");

const svRouter = new Router();

svRouter.get("/get-list-role", checkToken, Response(RoleController.getListRole))

svRouter.get("/get-role/:id", checkToken, Response(RoleController.getRoleById))

svRouter.post("/create-update-role", checkToken, Response(RoleController.createUpdateRole))

svRouter.post("/delete-role/:id", checkToken, Response(RoleController.deleteRole))

svRouter.post("/add-role-permission", checkToken, Response(RoleController.addRolePermission))

module.exports = svRouter




