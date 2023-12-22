const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");

const { Product, Category, Brand, Size, SizeColor, Color } = require("../model");

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
      exclude: ["updatedAt", "del", "category_id", "Brand_id", 'brand_id'],
    },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
        required: false,
        where: {
          del: 0,
        },
      },
      {
        model: Brand,
        as: "brand",
        attributes: ["id", "name"],
        required: false,
        where: {
          del: 0,
        },
      },
      {
        model: Color,
        as: "colors",
        attributes: {
          exclude: ["createdAt", "updatedAt", "del"],
        },
        required: false,
        where: {
          del: 0,
        },
      },
      {
        model: Size,
        as: "sizes",
        // attributes: ["id", "name"],
        required: false,
        attributes: {
          exclude: ["createdAt", "updatedAt", "del"],
        },
        where: {
          del: 0,
        },
        include: [
          {
            model: SizeColor,
            as: "size_color",
            attributes: ["id"],
            required: false,
            where: {
              del: 0,
            },
            include: [
              {
                model: Color,
                as: "color",
                // attributes: ["id", "name"],
                attributes: {
                  exclude: ["createdAt", "updatedAt", "del"],
                },
                required: false,
                where: {
                  del: 0,
                },
              },
            ],
          }
        ]
      }
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
    const existingProduct = await Product.findOne({
      where: {
        id: data.id,
      },
      include: [
        {
          model: Size,
          include: [
            {
              model: Color,
              through: SizeColor,
            },
          ],
        },
      ],
    });

    if (!existingProduct) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
    }

    // Update the product details
    await existingProduct.update({
      name: data.name,
      description: data.description,
      quantity: data.quantity,
      image: data.image,
      import_price: data.import_price,
      sell_price: data.sell_price,
      category_id: data.category_id,
      brand_id: data.brand_id,
      status: data.status,
      display_order: data.display_order,
      del: 0,
    });

    // Update or create associated sizes, colors, and size-color relationships
    for (const newSizeData of data.size_quantity) {
      const existingSize = existingProduct.Sizes.find((size) => size.size === newSizeData.size);

      if (existingSize) {
        await existingSize.update({ size: newSizeData.size });

        for (const newColorData of newSizeData.colors) {
          const existingColor = existingSize.Colors.find((color) => color.name === newColorData.name);

          if (existingColor) {
            // Update existing Color
            await existingColor.update({
              name: newColorData.name,
              image: newColorData.image,
              quantity: newColorData.quantity,
            });
          } else {
            // Create new Color
            const newColor = await Color.create({
              name: newColorData.name,
              image: newColorData.image,
              quantity: newColorData.quantity,
              product_id: existingProduct.id,
            });

            // Create new SizeColor relationship
            await SizeColor.create({ size_id: existingSize.id, color_id: newColor.id });
          }
        }
      } else {
        // Create new size, colors, and size-color relationships
        const newSize = await Size.create({
          size: newSizeData.size,
          product_id: existingProduct.id,
        });

        for (const newColorData of newSizeData.colors) {
          const newColor = await Color.create({
            name: newColorData.name,
            image: newColorData.image,
            quantity: newColorData.quantity,
            product_id: existingProduct.id,
          });

          // Create new SizeColor relationship
          await SizeColor.create({ size_id: newSize.id, color_id: newColor.id });
        }
      }
    }

    return existingProduct;
  } else {
    let create = await Product.create({
      name: data.name,
      description: data.description,
      quantity: data.quantity,
      image: data.image,
      import_price: data.import_price,
      sell_price: data.sell_price,
      category_id: data.category_id,
      brand_id: data.brand_id,
      status: data.status,
      display_order: data.display_order,
      del: 0
    })

    if (data.size_quantity.length > 0) {
      for (sizeData of data.size_quantity) {
        const size = await Size.create({
          size: sizeData.size,
          product_id: create.id
        })

        for (colorData of sizeData.colors) {
          // const [color, created] = await Color.findOrCreate({
          //   where: { name: colorData.name },
          //   defaults: { image: colorData.image, quantity: colorData.quantity },
          // });
          const color = await Color.create({
            name: colorData.name,
            image: colorData.image,
            quantity: colorData.quantity,
            product_id: create.id
          })
          await SizeColor.create({ size_id: size.id, color_id: color.id });
        }
      }

      return create
    }
  }
};

const deleteProduct = async (id) => {
  const record = await Product.findOne({
    where: {
      id: id,
      del: 0,
    },
  });

  if (!record) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return record.update({ del: 1 });
};

const getListProductWeb = async () => {
  const res = await Product.findAll({
    where: {
      status: 1,
      del: 0
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "del"],
    },
    order: [['display_order', 'asc']],
  })
  return res
}

module.exports = {
  getAllProducts,
  getProductById,
  createUpdateProduct,
  deleteProduct,
  getListProductWeb
};
