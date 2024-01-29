const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");
const { Product, Category, Brand, Size, SizeColor, Color, Comment, Customer, ProductType } = require("../model");
const excelJS = require("exceljs")
const { formatMoney } = require("../config/common");

const getAllProducts = async (data) => {
  let where = { del: 0 };
  const { page, limit, name, category_id, brand_id } = data;

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
      category_id: category_id
    };
  }

  if (brand_id) {
    where = {
      ...where,
      brand_id: brand_id
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
        model: ProductType,
        as: "product_type",
        attributes: ["id", "name"],
        required: false,
        where: {
          del: 0,
        }
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
      },
      {
        model: Comment,
        as: "comments",
        attributes: {
          exclude: ["createdAt", "updatedAt", "del"],
        },
        required: false,
        where: {
          del: 0,
        },
        include: {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "del", "password"],
          },
          required: false,
          where: {
            del: 0,
          }
        }
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
      product_type_id: data.product_type_id,
      status: data.status,
      display_order: data.display_order,
      discount: data.discount,
      discount_price: data.discount_price,
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
      product_type_id: data.product_type_id,
      status: data.status,
      display_order: data.display_order,
      discount: data.discount,
      discount_price: data.discount_price,
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

const getListProductWeb = async (req) => {
  const data = await Product.findAll({
    where: {
      status: 1,
      del: 0
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "del"],
    },
    order: [['display_order', 'asc']],
  })
  return data
}

const getDetailProduct = async (req) => {
  let where = {
    id: req.id,
    del: 0,
  }

  const data = await Product.findOne({
    where: {
      ...where,
    },
    attributes: {
      exclude: ["updatedAt", "category_id", "Brand_id", 'brand_id'],
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
      },
      {
        model: Comment,
        as: "comments",
        attributes: {
          exclude: ["createdAt", "updatedAt", "del"],
        },
        required: false,
        where: {
          del: 0,
        },
        include: {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "del", "password"],
          },
          required: false,
          where: {
            del: 0,
          }
        }
      }
    ],
  });
  return data
}

const exportListProduct = async (req, res) => {
  try {
    const { name, category_id, brand_id } = req.query
    let where = {
      del: 0
    }

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
        category_id: category_id
      };
    }

    if (brand_id) {
      where = {
        ...where,
        brand_id: brand_id
      };
    }

    const products = await Product.findAll({
      where: {
        ...where,
      },
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

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
    const name_file = 'products'
    // tạo một sheet nơi các đường lưới bị ẩn
    // worksheet.views = [{
    //   showGridLines: false
    // }]

    //thêm cột 
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 10, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Tên sản phẩm', key: 'name', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Số lượng', key: 'quantity', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Giá nhập', key: 'import_price', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Giá bán', key: 'sell_price', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Danh mục', key: 'category_id', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Thương hiệu', key: 'brand_id', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
      { header: 'Trạng thái', key: 'status', width: 20, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
    ];

    // đọc dữ liệu
    let length = 1
    products.map((item, index) => {
      worksheet.addRow({
        stt: index + 1,
        name: item.name ? item.name : '',
        quantity: item.quantity ? item.quantity : '',
        import_price: item.import_price ? formatMoney(item.import_price) + " vnd" : '',
        sell_price: item.sell_price ? formatMoney(item.sell_price) + " vnd" : '',
        category_id: item.category ? item.category?.name : '',
        brand_id: item.brand ? item.brand.name : '',
        status: item.status == 1 ? "Công bố" : "Không công bố",
      });
      length += 1
    })

    worksheet.insertRow(1, {})
    worksheet.insertRow(1, {})
    worksheet.insertRow(1, {})
    worksheet.insertRow(1, {})
    worksheet.mergeCells(1, 1, 1, worksheet.columns.length)
    worksheet.mergeCells(2, 1, 2, worksheet.columns.length)
    worksheet.mergeCells(3, 1, 3, worksheet.columns.length)
    worksheet.mergeCells(4, 1, 4, worksheet.columns.length)

    //designn header file
    worksheet.getCell('A1').value = 'DỰ ÁN QUẢN LÝ BÁN HÀNG - LẠI THẾ DŨNG'
    worksheet.getCell('A1').font = {
      size: 14,
      bold: true,
      color: { argb: 'FF0000' }
    }
    worksheet.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };

    worksheet.getCell('A2').value = 'DANH SÁCH SẢN PHẨM';
    worksheet.getCell('A2').font = {
      size: 18,
      bold: true,
    };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('A3').value = 'Từ trước đến nay';
    worksheet.getCell('A3').font = {
      size: 11,
      bold: true,
      color: { argb: 'FF0000' },
    };
    worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getRow(5).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: '00000000' } },
        left: { style: 'thin', color: { argb: '00000000' } },
        bottom: { style: 'thin', color: { argb: '00000000' } },
        right: { style: 'thin', color: { argb: '00000000' } }
      }
    });

    products.map((user, index) => {
      worksheet.getRow(6 + index).eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: '00000000' } },
          left: { style: 'thin', color: { argb: '00000000' } },
          bottom: { style: 'thin', color: { argb: '00000000' } },
          right: { style: 'thin', color: { argb: '00000000' } }
        }
      });
    })

    const rows = worksheet.getRows(5, length);
    rows.map((row, i) => {
      worksheet.getRow(5 + i).height = 20
    })

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${name_file}.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createUpdateProduct,
  deleteProduct,
  exportListProduct,
  getListProductWeb,
  getDetailProduct
};
