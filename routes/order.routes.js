const { OrderController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_DON_HANG } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/get-list-order", check_permission(QUAN_LY_DON_HANG), Response(OrderController.getListOrder));

svRouter.post("/update-status-order", check_permission(QUAN_LY_DON_HANG), Response(OrderController.updateStatusOrder));

svRouter.post("/new-order", Response(OrderController.newOrder));

module.exports = svRouter;
