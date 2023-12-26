const Tutorial = require("./tutorial.routes");
const Product = require("./product.routes");
const Category = require("./category.routes");
const User = require("./user.routes");
const Crawl = require("./crawl.routes");
const Permission = require("./permission.routes");
const Role = require("./role.routes");
const ExportExcel = require("./exportExcel.routes");
const Payment = require("./payment.routes");
const Voucher = require("./voucher.routes");

const { Router } = require("express");
const routerApp = new Router();

//register,login profile
routerApp.use("", User);

//manement permission
routerApp.use("/api/permission", Permission);
routerApp.use("/api/role", Role);
routerApp.use("/api/exportExcel", ExportExcel);
routerApp.use("/api/payment", Payment);

routerApp.use("/api/crawl", Crawl);
routerApp.use("/api/tutorial", Tutorial);
routerApp.use("/api/product", Product);
routerApp.use("", Category);
routerApp.use("/api/voucher", Voucher);

module.exports = routerApp;
