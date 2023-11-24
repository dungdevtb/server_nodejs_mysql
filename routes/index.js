const Tutorial = require("./tutorial.routes");
const Product = require("./product.routes");
const category = require("./category.routes");
const User = require("./user.routes");
const Crawl = require("./crawl.routes");

const { Router } = require("express");
const routerApp = new Router();

//register,login profile
routerApp.use("", User);

routerApp.use("/api/crawl", Crawl);
routerApp.use("/api/tutorial", Tutorial);
routerApp.use("/api/product", Product);
routerApp.use("/api/category", category);

module.exports = routerApp;
