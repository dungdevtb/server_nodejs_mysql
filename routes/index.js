const Tutorial = require("./tutorial.routes");
const Product = require("./product.routes");
const category = require("./category.routes");

const { Router } = require("express");
const routerApp = new Router();

routerApp.use("/api/tutorial", Tutorial);
routerApp.use("/api/product", Product);
routerApp.use("/api/category", category);

module.exports = routerApp;
