const Tutorial = require("./tutorial.routes");

const { Router } = require("express");

const routerApp = new Router();

routerApp.use("/api/tutorial", Tutorial);
