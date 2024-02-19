const { ERROR_MESSAGE } = require("../config/error");
const { Banner } = require("../model");

const getListBanner = async (req) => {
    let where = {}

    if (req.type) {
        where = {
            ...where,
            type: req.type
        }
    }

    const data = await Banner.findAll({
        order: [['createdAt', 'asc']],
        where: {
            ...where
        },
        attributes: {
            exclude: ["updatedAt", "del"],
        },
    });

    const total = await Banner.count({
        where: {
            ...where
        }
    })

    return {
        rows: data,
        total
    }
}

const createUpdateBanner = async (data) => {
    if (data.id) {
        const check = await Banner.findOne({
            where: {
                id: data.id,
                del: 0
            }
        })

        if (!check) {
            throw ERROR_MESSAGE.DATA_NOT_FOUND
        }

        const update = await check.update({ ...data })

        return update
    } else {
        const create = await Banner.create({
            ...data,
            del: 0
        })

        return create
    }
}

const deleteBanner = async (id) => {
    const checkdel = await Banner.findOne({
        where: {
            id: id,
            del: 0
        }
    })

    if (!checkdel) {
        throw ERROR_MESSAGE.DATA_NOT_FOUND
    }

    return await checkdel.update({ del: 1 })
}

module.exports = {
    getListBanner,
    createUpdateBanner,
    deleteBanner
}

