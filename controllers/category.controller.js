const { categoryServices } = require("../service");

//category
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

//brand
const getListBrand = async (req, res) => {
  const data = req.query;
  return categoryServices.getListBrand(data);
};

const getBrandById = async (req, res) => {
  const { id } = req.params;
  return categoryServices.getBrandById(id);
};

const createUpdateBrand = async (req, res) => {
  const data = req.body;

  return categoryServices.createUpdateBrand(data);
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;
  return categoryServices.deleteBrand(id);
};

//product_type
const getListProductType = async (req, res) => {
  const data = req.query;
  return categoryServices.getListProductType(data);
};

const getProductTypeById = async (req, res) => {
  const { id } = req.params;
  return categoryServices.getProductTypeById(id);
};

const createUpdateProductType = async (req, res) => {
  const data = req.body;

  return categoryServices.createUpdateProductType(data);
};

const deleteProductType = async (req, res) => {
  const { id } = req.params;
  return categoryServices.deleteProductType(id);
};


module.exports = {
  getAllCategorys,
  getCategoryById,
  createUpdateCategory,
  deleteCategory,
  getListBrand,
  getBrandById,
  createUpdateBrand,
  deleteBrand,
  getListProductType,
  getProductTypeById,
  createUpdateProductType,
  deleteProductType,
};
