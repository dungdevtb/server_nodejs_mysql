const { tutorialServices } = require("../service");

const getAllTutorials = async (req, res) => {
  return tutorialServices.getAllTutorials(req, res);
};

const getTutorialById = async (req, res) => {
  const { id } = req.params;
  return tutorialServices.getTutorialById(id, res);
};

const createTutorial = async (req, res) => {
  const data = req.body;

  return tutorialServices.createTutorial(data);
};

const updateTutorial = async (req, res) => {
  const data = req.body;
  return tutorialServices.updateTutorial(data);
};

const deleteTutorial = async (req, res) => {
  const { id } = req.params;
  return tutorialServices.deleteTutorial(id);
};

module.exports = {
  getAllTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
};
