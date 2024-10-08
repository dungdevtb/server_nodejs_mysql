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
const Post = require("./post.routes");
const Customer = require("./customer.routes");
const Order = require("./order.routes");
const Banner = require("./banner.routes");
const Guitar = require("./guitar.routes");

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
routerApp.use("/api/post", Post);

routerApp.use("/api/customer", Customer);
routerApp.use("/api/order", Order);

routerApp.use("/api/banner", Banner);
routerApp.use("/api/guitar", Guitar);

module.exports = routerApp;
