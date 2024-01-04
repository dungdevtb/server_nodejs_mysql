const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");
const { randomTransactionId } = require("../config/momo/random")

const { Order, Voucher, OrderProduct, VoucherProduct, Customer, Product, Color } = require("../model");
const moment = require("moment");

const getListOrder = async (req) => {
    const { page, limit, status, price, search, date } = req

    const paging = Paging(page, limit)

    let where = {
        del: 0,
        //   status: { [Op.gte]: 0 }, 
        payment_type: { [Op.not]: null }
    };

    // console.log(JSON.parse(status));
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
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "del"],
                        },
                        required: false,
                        as: 'product'
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

const updateStatusOrder = async (req) => {

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

const exportListOrder = async (req) => {

}

module.exports = {
    getListOrder,
    updateStatusOrder,
    newOrder,
    exportListOrder
}




