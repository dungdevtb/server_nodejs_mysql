const { PaymentController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");
const { isAuthAdmin } = require("../middleware/auth");

const svRouter = new Router();

svRouter.post('/create-momo-atm-payment', isAuthAdmin, (PaymentController.createATMMomoFastPayment));

module.exports = svRouter