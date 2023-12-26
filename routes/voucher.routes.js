const { VoucherController } = require("../controllers")
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { check_permission } = require("../middleware/auth");
const { QUAN_LY_KHUYEN_MAI } = require("../middleware/actionDefault");
const svRouter = new Router();

svRouter.get("/get-list-voucher", check_permission(QUAN_LY_KHUYEN_MAI), Response(VoucherController.getListVouchers))

svRouter.get("/get-voucher/:id", check_permission(QUAN_LY_KHUYEN_MAI), Response(VoucherController.getVoucherById))

svRouter.post("/create-update-voucher", check_permission(QUAN_LY_KHUYEN_MAI), Response(VoucherController.createUpdateVoucher))

svRouter.post("/delete-voucher/:id", check_permission(QUAN_LY_KHUYEN_MAI), Response(VoucherController.deleteVoucher))

module.exports = svRouter




