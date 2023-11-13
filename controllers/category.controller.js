const { categoryServices } = require("../service");

const getAllCategorys = async (req, res) => {
  const data = req.query;
  return categoryServices.getAllCategorys(data);
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  return categoryServices.getCategoryById(id);
};

const createUpdateCategory = async (req, res) => {
  const data = req.body;

  return categoryServices.createUpdateCategory(data);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  return categoryServices.deleteCategory(id);
};

module.exports = {
  getAllCategorys,
  getCategoryById,
  createUpdateCategory,
  deleteCategory,
};
