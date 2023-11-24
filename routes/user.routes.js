const { UserController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { checkToken } = require("../middleware/validateTokenHandler");

const svRouter = new Router();

svRouter.post("/login", Response(UserController.login));

svRouter.post("/register", Response(UserController.register));

svRouter.get("/profile", checkToken, Response(UserController.profile));

module.exports = svRouter;
