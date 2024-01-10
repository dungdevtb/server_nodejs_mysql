const { productServices } = require("../service");

const getAllProducts = async (req, res) => {
  const data = req.query;
  return productServices.getAllProducts(data);
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  return productServices.getProductById(id);
};

const createUpdateProduct = async (req, res) => {
  const data = req.body;
  return productServices.createUpdateProduct(data);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  return productServices.deleteProduct(id);
};

const exportExcelListProduct = async (req, res) => {
  return productServices.exportListProduct(req, res);
}

module.exports = {
  getAllProducts,
  getProductById,
  createUpdateProduct,
  deleteProduct,
  exportExcelListProduct
};
