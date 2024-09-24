// var router = require("express").Router();
const { GuitarController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_DANH_MUC } = require("../middleware/actionDefault");

const svRouter = new Router();

svRouter.get("/get-list-guitar",
    check_permission(QUAN_LY_DANH_MUC),
    Response(GuitarController.getListGuitar));

svRouter.post("/create-update-guitar",
    check_permission(QUAN_LY_DANH_MUC),
    Response(GuitarController.createUpdateGuitar));

svRouter.post("/delete-guitar/:id",
    check_permission(QUAN_LY_DANH_MUC),
    Response(GuitarController.deleteGuitar));

module.exports = svRouter;