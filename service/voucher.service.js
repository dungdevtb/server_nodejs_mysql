const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");
const { Voucher, VoucherProduct, Product } = require("../model");
const moment = require("moment");

const getListVouchers = async (req) => {
    const { page, limit, name, code, date } = req;

    const paging = Paging(page, limit);
    let where = { del: 0 };
    if (name && name != '') {
        where = {
            ...where,
            name: {
                [Op.like]: `%${name}%`
            }
        }
    }

    if (code) {
        where = {
            ...where,
            code: code
        }
    }

    if (date) {
        const start_date = data[0];
        const end_date = data[1];

        where = {
            ...where,
            [Op.and]: [
                {
                    exp: {
                        [Op.gte]: moment(start_date).startOf('day')
                    }
                },
                {
                    exp: {
                        [Op.lte]: moment(end_date).endOf('day')
                    }
                }
            ]
        }
    }

    const data = await Voucher.findAll({
        where: {
            ...where
        },
        ...paging,
        order: [['createdAt', 'desc']],
        attributes: {
            exclude: ["updatedAt", "del"],
        },
        include: [
            {
                model: VoucherProduct,
                as: 'voucher_product',
                required: false,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'del']
                },
                include: [
                    {
                        model: Product,
                        as: 'product',
                        required: false,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'del']
                        }
                    }
                ]
            }
        ]
    });

    const total = await Voucher.count({
        where: {
            ...where
        }
    })

    return {
        rows: data,
        total
    }
}

const getVoucherById = async (id) => {
    const data = await Voucher.findOne({
        where: {
            id: id,
            del: 0
        }
    })

    return data
}

const createUpdateVoucher = async (data) => {
    if (data.id) {
        const check = await Voucher.findOne({
            where: {
                id: data.id,
                del: 0
            }
        })

        if (!check) {
            throw ERROR_MESSAGE.DATA_NOT_FOUND
        }

        const check_code = await Voucher.findOne({
            where: {
                code: data.code,
                del: 0,
                id: {
                    [Op.ne]: data.id
                }
            }
        })

        if (check_code) {
            throw ERROR_MESSAGE.VOUCHER_EXIST
        }

        if (data.type_voucher == 2) {
            //for product
            await VoucherProduct.destroy({
                where: {
                    voucher_id: data.id
                }
            })

            await VoucherProduct.bulkCreate(data.products.map(product => {
                return {
                    voucher_id: data.id,
                    product_id: product.id
                }
            }))
        }

        const update = await Voucher.update({
            ...data
        })

        return update
    } else {
        const check_code = await Voucher.findOne({
            where: {
                code: data.code,
                del: 0
            }
        })
        if (check_code) {
            throw ERROR_MESSAGE.VOUCHER_EXIST
        }

        if (data.type_voucher == 1) {
            //for order
            const voucher = await Voucher.create({
                ...data,
                del: 0
            })

            return voucher
        }

        if (data.type_voucher == 2) {
            //for product
            const voucher = await Voucher.create({
                ...data,
                del: 0
            })

            await VoucherProduct.bulkCreate(data.products.map(product => {
                return {
                    voucher_id: voucher.id,
                    product_id: product.id
                }
            }))

            return voucher
        }
    }
}

const deleteVoucher = async (id) => {
    const voucher = await Voucher.findOne({
        where: {
            id: id,
            del: 0
        }
    })

    if (!voucher) {
        throw ERROR_MESSAGE.DATA_NOT_FOUND
    }

    return await voucher.update({ del: 1 })
}

module.exports = {
    getListVouchers,
    getVoucherById,
    createUpdateVoucher,
    deleteVoucher
}

