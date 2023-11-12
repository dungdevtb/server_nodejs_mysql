// const db = require("../model/dbconnect");
// const Tutorial = db.tutorials;
const { Op } = require("sequelize");
const { Tutorial } = require("../model");

const getAllTutorials = async (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  const data = await Tutorial.findAll({ where: condition });
  const total = await Tutorial.count();

  return { data, total };
};

const getTutorialById = async (id, res) => {
  const data = await Tutorial.findOne({ id: id });
  return data;
};

const createTutorial = async (data) => {
  const dataCreate = await Tutorial.create(data);

  return dataCreate;
};

const updateTutorial = async (data) => {
  const { id } = data;

  const dataUpdate = Tutorial.update(data, {
    where: { id: id },
  });

  return dataUpdate;
};

const deleteTutorial = async (id) => {
  await Tutorial.destroy({
    where: { id: id },
  });

  return "Delete success id: " + id;
};

module.exports = {
  getAllTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
};
