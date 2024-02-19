const { BannerController } = require("../controllers")
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_BANNER } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/get-list-banner", Response(BannerController.getListBanner))

svRouter.post("/create-update-banner", check_permission(QUAN_LY_BANNER), Response(BannerController.createUpdateBanner))

svRouter.post("/delete-banner/:id", check_permission(QUAN_LY_BANNER), Response(BannerController.deleteBanner))

module.exports = svRouter




