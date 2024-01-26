const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");

const { Category, Product, Brand, ProductType } = require("../model");

//*********************Category**************** */
const getAllCategorys = async (data) => {
  const { page, limit, name } = data;

  const paging = Paging(page, limit);
  let where = { del: 0 };

  if (name) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${name.trim()}%`,
        //  [Op.substring]: `${name.trim()}`,     // LIKE '%name%' tương tự lệnh bên trên
      },
    };
  }

  const res = await Category.findAll({
    where: {
      ...where,
    },
    ...paging,
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["id", "name"],
      }
    ],
    order: [["createdAt", "desc"]],
  });

  const total = await Category.count({
    where: {
      ...where,
    },
  });

  return { rows: res, total };
};

const getCategoryById = async (id) => {
  const where = {
    id: id,
    del: 0,
  };

  const res = await Category.findOne({
    where: {
      ...where,
    },
  });

  return res;
};

const createUpdateCategory = async (data) => {
  if (data.id) {
    const record = await Category.findOne({
      where: {
        id: data.id,
      },
    });

    if (!record) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
    }

    return record.update({ ...data });
  } else {
    return Category.create({ ...data, del: 0 });
  }
};

const deleteCategory = async (id) => {
  const record = await Category.findOne({
    where: {
      id: id,
      del: 0
    },
  });

  if (!record) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return record.update({ del: 1 });
};

//*********************Brand **********************/
const getListBrand = async (data) => {
  const { page, limit, name } = data;

  const paging = Paging(page, limit);
  let where = { del: 0 };

  if (name) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${name.trim()}%`,
        //  [Op.substring]: `${name.trim()}`,     // LIKE '%name%' tương tự lệnh bên trên
      },
    };
  }

  const res = await Brand.findAll({
    where: {
      ...where,
    },
    ...paging,
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["id", "name"],
      }
    ],
    order: [["createdAt", "desc"]],
  });

  const total = await Brand.count({
    where: {
      ...where,
    },
  });

  return { rows: res, total };
};

const getBrandById = async (id) => {
  const where = {
    id: id,
    del: 0,
  };

  const res = await Brand.findOne({
    where: {
      ...where,
    },
  });

  return res;
};

const createUpdateBrand = async (data) => {
  if (data.id) {
    const record = await Brand.findOne({
      where: {
        id: data.id,
      },
    });

    if (!record) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
    }

    return record.update({ ...data });
  } else {
    return Brand.create({ ...data, del: 0 });
  }
};

const deleteBrand = async (id) => {
  const record = await Brand.findOne({
    where: {
      id: id,
      del: 0
    },
  });

  if (!record) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return record.update({ del: 1 });
};


//*********************ProductType **********************/
const getListProductType = async (data) => {
  const { page, limit, name } = data;

  const paging = Paging(page, limit);
  let where = { del: 0 };

  if (name) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${name.trim()}%`,
        //  [Op.substring]: `${name.trim()}`,     // LIKE '%name%' tương tự lệnh bên trên
      },
    };
  }

  const res = await ProductType.findAll({
    where: {
      ...where,
    },
    ...paging,
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["id", "name"],
      }
    ],
    order: [["createdAt", "desc"]],
  });

  const total = await ProductType.count({
    where: {
      ...where,
    },
  });

  return { rows: res, total };
};

const getProductTypeById = async (id) => {
  const where = {
    id: id,
    del: 0,
  };

  const res = await ProductType.findOne({
    where: {
      ...where,
    },
  });

  return res;
};

const createUpdateProductType = async (data) => {
  if (data.id) {
    const record = await ProductType.findOne({
      where: {
        id: data.id,
      },
    });

    if (!record) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
    }

    return record.update({ ...data });
  } else {
    return ProductType.create({ ...data, del: 0 });
  }
};

const deleteProductType = async (id) => {
  const record = await ProductType.findOne({
    where: {
      id: id,
      del: 0
    },
  });

  if (!record) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return record.update({ del: 1 });
};

module.exports = {
  //category
  getAllCategorys,
  getCategoryById,
  createUpdateCategory,
  deleteCategory,

  //brand
  getListBrand,
  getBrandById,
  createUpdateBrand,
  deleteBrand,

  //producttype
  getListProductType,
  getProductTypeById,
  createUpdateProductType,
  deleteProductType
};
