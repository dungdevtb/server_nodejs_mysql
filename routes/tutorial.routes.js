const tutorialsController = require("../controllers/tutorial.controller");
// var router = require("express").Router();
const { Router } = require("express");
const { Response } = require("../config/handle_response");

const svRouter = new Router();

svRouter.get(
  "/get_all_tutorials",
  Response(tutorialsController.getAllTutorials)
);

svRouter.get(
  "/get_tutorial/:id",
  Response(tutorialsController.getTutorialById)
);

svRouter.post("/create_tutorial", Response(tutorialsController.createTutorial));

svRouter.put("/update_tutorial", Response(tutorialsController.updateTutorial));

svRouter.delete(
  "/delete_tutorial/:id",
  Response(tutorialsController.deleteTutorial)
);

module.exports = svRouter;
