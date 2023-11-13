// var router = require("express").Router();
const { TutorialController } = require("../controllers");
const { Router } = require("express");
const { Response } = require("../config/handle_response");

const svRouter = new Router();

svRouter.get(
  "/get_all_tutorials",
  Response(TutorialController.getAllTutorials)
);

svRouter.get("/get_tutorial/:id", Response(TutorialController.getTutorialById));

svRouter.post("/create_tutorial", Response(TutorialController.createTutorial));

svRouter.put("/update_tutorial", Response(TutorialController.updateTutorial));

svRouter.delete(
  "/delete_tutorial/:id",
  Response(TutorialController.deleteTutorial)
);

module.exports = svRouter;
