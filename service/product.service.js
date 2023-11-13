const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");

const { Product, Category } = require("../model");

const getAllProducts = async (data) => {
  let where = { del: 0 };
  const { page, limit, name, category_id } = data;

  const paging = Paging(page, limit);

  if (name) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${name.trim()}%`,
        //  [Op.substring]: 'name',     // LIKE '%name%' tương tự lệnh bên trên
      },
    };
  }

  if (category_id) {
    where = {
      ...where,
      category_id: {
        // [Op.like]: `%${category_id.trim()}%`,
        [Op.substring]: `${category_id.trim()}`, // LIKE '%name%' tương tự lệnh bên trên
      },
    };
  }

  const res = await Product.findAll({
    where: {
      ...where,
    },
    ...paging,
    order: [["createdAt", "desc"]],
    attributes: {
      exclude: ["createdAt", "updatedAt", "del", "category_id"],
    },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
        where: {
          del: 0,
        },
      },
    ],
  });

  const total = await Product.count({
    where: {
      ...where,
    },
  });

  return { rows: res, total };
};

const getProductById = async (id) => {
  const where = {
    id: id,
    del: 0,
  };

  const res = await Product.findOne({
    where: {
      ...where,
    },
  });

  return res;
};

const createUpdateProduct = async (data) => {
  if (data.id) {
    const record = await Product.findOne({
      where: {
        id: data.id,
      },
    });

    if (!record) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
    }

    return record.update({ ...data });
  } else {
    return Product.create({ ...data, del: 0 });
  }
};

const deleteProduct = async (id) => {
  const record = await Product.findOne({
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
  getAllProducts,
  getProductById,
  createUpdateProduct,
  deleteProduct,
};
