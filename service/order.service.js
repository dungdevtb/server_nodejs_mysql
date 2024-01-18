const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");
const { randomTransactionId } = require("../config/momo/random")
const { Order, Voucher, OrderProduct, VoucherProduct, Customer, Product, Color, Brand, Category, Cart, CartProduct } = require("../model");
const moment = require("moment");
const excelJS = require("exceljs")
const { formatMoney } = require("../config/common");

const getListOrder = async (req) => {
    const { page, limit, status, price, search, date } = req

    const paging = Paging(page, limit)

    let where = {
        del: 0,
        //   status: { [Op.gte]: 0 }, 
        payment_type: { [Op.not]: null }
    };

    if (status) {
        where = {
            ...where,
            status: {
                [Op.in]: typeof (status) == "string" ? JSON.parse(status) : status
            }
        }
    }

    if (price) {
        where = {
            ...where,
            [Op.and]: [
                {
                    total: {
                        [Op.gte]: parseFloat(price[0])
                    }
                }, {
                    total: {
                        [Op.lte]: parseFloat(price[1])
                    }
                }
            ]
        }
    }

    const mobile_update = search ? search.trim() : "";
    const new_mobile = mobile_update.indexOf('+') == 0 ? mobile_update : mobile_update.replace(mobile_update.charAt(0), '+84');

    if (search) {
        let list_op = []
        list_op = [
            {
                order_code: {
                    [Op.like]: `%${search}%`
                }
            }, {
                'Customer.username': {
                    [Op.like]: `%${search}%`
                }
            }, {
                'Customer.email': {
                    [Op.like]: `%${search}%`
                }
            }
        ]

        if (new_mobile) {
            list_op.push({
                'Customer.mobile': {
                    [Op.like]: `%${new_mobile}%`
                }
            })
        }

        where = {
            ...where,
            [Op.or]: list_op
        }
    }

    if (date) {
        date = JSON.parse(date)
        where = {
            ...where,
            [Op.and]: [
                {
                    createdAt: {
                        [Op.gte]: moment(date[0]).utcOffset(7).startOf('day')
                    }
                }, {
                    createdAt: {
                        [Op.lte]: moment(date[1]).utcOffset(7).endOf('day')
                    }
                }
            ]
        }
    }

    const data = await Order.findAll({
        where: {
            ...where
        },
        ...paging,
        include: [
            {
                model: Customer,
                attributes: ['id', 'username', 'email', 'mobile', 'address'],
                required: false,
                as: 'customer',
            },
            {
                model: OrderProduct,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "del"],
                },
                as: 'order_product',
                required: false,
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'brand_id', 'category_id', 'name', 'sell_price', 'image', 'description'],
                        required: false,
                        as: 'product',
                        include: [
                            {
                                model: Brand,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'brand',
                            },
                            {
                                model: Category,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'category',
                            }
                        ]
                    }
                ]
            },
            {
                model: Voucher,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "del"],
                },
                required: false,
                as: 'voucher',
                include: [
                    {
                        model: VoucherProduct,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "del"],
                        },
                        required: false,
                        as: 'voucher_product',
                        include: [
                            {
                                model: Product,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'product'
                            }
                        ]
                    }
                ]
            }
        ],
        attributes: {
            exclude: ["updatedAt", "del"],
        },
        order: [['createdAt', 'desc']]
    })

    const total = await Order.count({
        where: {
            ...where
        }
    })

    return {
        rows: data,
        total
    }
}

const getDetailOrder = async (req) => {
    const data = await Order.findOne({
        where: {
            id: req.id,
            del: 0
        },
        include: [
            {
                model: Customer,
                attributes: ['id', 'username', 'email', 'mobile', 'address'],
                required: false,
                as: 'customer',
            },
            {
                model: OrderProduct,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "del"],
                },
                as: 'order_product',
                required: false,
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'brand_id', 'category_id', 'name', 'sell_price', 'image', 'description'],
                        required: false,
                        as: 'product',
                        include: [
                            {
                                model: Brand,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'brand',
                            },
                            {
                                model: Category,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'category',
                            }
                        ]
                    }
                ]
            },
            {
                model: Voucher,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "del"],
                },
                required: false,
                as: 'voucher',
                include: [
                    {
                        model: VoucherProduct,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "del"],
                        },
                        required: false,
                        as: 'voucher_product',
                        include: [
                            {
                                model: Product,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'product'
                            }
                        ]
                    }
                ]
            }
        ],
        attributes: {
            exclude: ["updatedAt", "del"],
        },
        order: [['createdAt', 'desc']]
    })

    return data
}

const updateStatusOrder = async (req) => {
    const check = await Order.findOne({
        where: {
            id: req.id,
            del: 0
        }
    })

    if (!check) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    return check.update({
        status: req.status
    })
}

const newOrder = async (req) => {
    try {
        const order_code = randomTransactionId('DH')

        let data = {
            ...req,
            order_code,
            status: 0, // tạo đơn hàng mới
        }

        const create = await Order.create(data)

        await Promise.all(req.order_product.map(async (item) => {
            await OrderProduct.create({
                product_id: item.product_id,
                order_id: create.id,
                quantity: item.quantity,
            })

            let quantity = item.quantity
            const color = await Color.findOne({
                where: {
                    id: item.color_id,
                    product_id: item.product_id,
                }
            })

            if (color) {
                // await Color.update({
                //     quantity: color.quantity - quantity
                // }, {
                //     where: {
                //         id: color.id
                //     }
                // })
                color.quantity -= quantity
                await color.save()
            }

        }))

        return create
    } catch (error) {
        console.log('Error newOrder: ', error);
        throw error
    }
}

const renderStatus = (status) => {
    switch (status) {
        case 0:
            return "Đơn hàng mới"
        case 1:
            return "Chờ xử lý"
        case 2:
            return "Đang giao hàng"
        case 3:
            return "Hủy"
        case 4:
            return "Thành công"
        default:
            // return "Không xác định"
            break;
    }
}

const exportListOrder = async (req, res) => {
    try {
        const { status, price, search, date } = req

        let where = {
            del: 0,
            //   status: { [Op.gte]: 0 }, 
            payment_type: { [Op.not]: null }
        };

        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: typeof (status) == "string" ? JSON.parse(status) : status
                }
            }
        }

        if (price) {
            where = {
                ...where,
                [Op.and]: [
                    {
                        total: {
                            [Op.gte]: parseFloat(price[0])
                        }
                    }, {
                        total: {
                            [Op.lte]: parseFloat(price[1])
                        }
                    }
                ]
            }
        }

        const mobile_update = search ? search.trim() : "";
        const new_mobile = mobile_update.indexOf('+') == 0 ? mobile_update : mobile_update.replace(mobile_update.charAt(0), '+84');

        if (search) {
            let list_op = []
            list_op = [
                {
                    order_code: {
                        [Op.like]: `%${search}%`
                    }
                }, {
                    'Customer.username': {
                        [Op.like]: `%${search}%`
                    }
                }, {
                    'Customer.email': {
                        [Op.like]: `%${search}%`
                    }
                }
            ]

            if (new_mobile) {
                list_op.push({
                    'Customer.mobile': {
                        [Op.like]: `%${new_mobile}%`
                    }
                })
            }

            where = {
                ...where,
                [Op.or]: list_op
            }
        }

        if (date) {
            date = JSON.parse(date)
            where = {
                ...where,
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.gte]: moment(date[0]).utcOffset(7).startOf('day')
                        }
                    }, {
                        createdAt: {
                            [Op.lte]: moment(date[1]).utcOffset(7).endOf('day')
                        }
                    }
                ]
            }
        }

        const orders = await Order.findAll({
            where: {
                ...where
            },
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'username', 'email', 'mobile', 'address'],
                    required: false,
                    as: 'customer',
                },
                {
                    model: OrderProduct,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "del"],
                    },
                    as: 'order_product',
                    required: false,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'brand_id', 'category_id', 'name', 'sell_price', 'image', 'description'],
                            required: false,
                            as: 'product',
                            include: [
                                {
                                    model: Brand,
                                    attributes: {
                                        exclude: ["createdAt", "updatedAt", "del"],
                                    },
                                    required: false,
                                    as: 'brand',
                                },
                                {
                                    model: Category,
                                    attributes: {
                                        exclude: ["createdAt", "updatedAt", "del"],
                                    },
                                    required: false,
                                    as: 'category',
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Voucher,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "del"],
                    },
                    required: false,
                    as: 'voucher',
                    include: [
                        {
                            model: VoucherProduct,
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "del"],
                            },
                            required: false,
                            as: 'voucher_product',
                            include: [
                                {
                                    model: Product,
                                    attributes: {
                                        exclude: ["createdAt", "updatedAt", "del"],
                                    },
                                    required: false,
                                    as: 'product'
                                }
                            ]
                        }
                    ]
                }
            ],
            attributes: {
                exclude: ["updatedAt", "del"],
            },
            order: [['createdAt', 'desc']]
        })

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');
        const name_file = 'orders'
        // tạo một sheet nơi các đường lưới bị ẩn
        // worksheet.views = [{
        //   showGridLines: false
        // }]

        //thêm cột 
        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Mã đơn hàng', key: 'order_code', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Trạng thái đơn hàng', key: 'status', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Hình thức thanh toán', key: 'payment_type', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Hình thức vận chuyển', key: 'delivery_type', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Voucher', key: 'voucher', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Ngày đặt hàng', key: 'createdAt', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Khách hàng', key: 'customer', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Tổng tiền', key: 'total', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
        ];

        // đọc dữ liệu
        let length = 1
        orders.map((item, index) => {
            worksheet.addRow({
                stt: index + 1,
                order_code: item.order_code ? item.order_code : '',
                status: item.status ? renderStatus(item.status) : '',
                payment_type: item?.payment_type === 1 ? 'Thanh toán khi giao hàng' : 'Thanh toán online',
                delivery_type: item?.delivery_type === 1 ? 'Vận chuyển thường' : 'Vận chuyển hỏa tốc',
                voucher: item.voucher ? item.voucher.name : '',
                createdAt: item.category ? moment(item.createdAt).format('DD/MM/YYYY') : '',
                customer: item.customer ? item.customer.username : '',
                total: item.total ? formatMoney(item.total) + " vnd" : '',
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

        worksheet.getCell('A2').value = 'DANH SÁCH ĐƠN HÀNG';
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

        orders.map((user, index) => {
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

const addToCart = async (req) => {
    try {
        const { id, product_id, quantity } = req.cart_product

        let cart = await Cart.findOne({
            where: {
                customer_id: req.customer_id,
            }
        })

        if (!cart) {
            cart = await Cart.create({
                customer_id: req.customer_id,
            })
        }

        const existCartProduct = await CartProduct.findOne({
            where: {
                id: id,
                product_id: product_id,
                del: 0
            }
        })

        if (existCartProduct) {
            // cập nhật số lượng 
            await existCartProduct.update({
                quantity: quantity
            })
        } else {
            //thêm sản phẩm vào giỏ hảng
            await CartProduct.create({
                product_id: product_id,
                cart_id: cart.id,
                quantity: quantity,
            })
        }

        return cart
    } catch (error) {
        console.log('Error addtoCart: ', error);
        throw error
    }
}

const removeFromCart = async (req) => {
    try {
        const cartProduct = await CartProduct.findOne({
            where: {
                id: req.id,
                product_id: req.product_id,
            },
        });

        if (cartProduct) {
            // Xóa sản phẩm khỏi giỏ hàng
            await cartProduct.destroy();
            return true; // Trả về true nếu sản phẩm đã được xóa thành công
        } else {
            return false; // Trả về false nếu không tìm thấy sản phẩm trong giỏ hàng
        }
    } catch (error) {
        console.log('Error removeFromCart: ', error);
        throw error;
    }
};

const getDetailCart = async (req) => {
    const data = await Cart.findOne({
        where: {
            customer_id: req.customer_id,
            del: 0
        },
        include: [
            {
                model: CartProduct,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "del"],
                },
                as: 'cart_product',
                required: false,
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'brand_id', 'category_id', 'name', 'sell_price', 'image', 'description'],
                        required: false,
                        as: 'product',
                        include: [
                            {
                                model: Brand,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'brand',
                            },
                            {
                                model: Category,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt", "del"],
                                },
                                required: false,
                                as: 'category',
                            }
                        ]
                    }
                ]
            },
        ],
        attributes: {
            exclude: ["updatedAt", "del", "createdAt"],
        },
    })

    return data
}

module.exports = {
    getListOrder,
    getDetailOrder,
    updateStatusOrder,
    newOrder,
    exportListOrder,
    addToCart,
    removeFromCart,
    getDetailCart
}




