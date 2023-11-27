const { UserController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken } = require("../middleware/validateTokenHandler");

const svRouter = new Router();

svRouter.post("/login", Response(UserController.login));

svRouter.post("/register", Response(UserController.register));

svRouter.get("/api/user/get_profile", checkToken, Response(UserController.getProfile));
svRouter.post("/api/user/update_profile", checkToken, Response(UserController.updateProfile));
svRouter.post("/api/user/change_password", checkToken, Response(UserController.changePassword));

module.exports = svRouter;
