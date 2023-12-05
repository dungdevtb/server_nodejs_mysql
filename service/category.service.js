const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");

const { Category, Product } = require("../model");

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
    },
  });

  if (!record) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return record.update({ del: 1 });
};

module.exports = {
  getAllCategorys,
  getCategoryById,
  createUpdateCategory,
  deleteCategory,
};
