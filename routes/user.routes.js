const { UserController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const validateToken = require("../middleware/validateTokenHandler");

const svRouter = new Router();

svRouter.post("/login", Response(UserController.login));

svRouter.post("/register", Response(UserController.register));

svRouter.get("/profile", validateToken, Response(UserController.profile));

module.exports = svRouter;
