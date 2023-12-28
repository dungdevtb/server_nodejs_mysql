const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");

const { Post, PostTag, PostCategory, PostHookTag } = require("../model");

//Post
const getListPost = async (data) => {
    const { page, limit, title } = data
    const paging = Paging(page, limit)

    let where = { del: 0 }
    if (title) {
        where = {
            ...where,
            title: {
                [Op.like]: `%${title}%`
            }
        }
    }

    const res = await Post.findAll({
        where: {
            ...where,
            title: {
                [Op.notLike]: ""
            }
        },
        ...paging,
        include: [
            {
                model: PostHookTag,
                as: "tag",
                required: false,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "del"],
                },
                include: [
                    {
                        model: PostTag,
                        as: "tag",
                        required: false,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "del"],
                        }
                    }
                ]
            }
        ],
        order: [['createdAt', 'desc']],
    })

    const total = await Post.count({
        where: {
            ...where,
            title: {
                [Op.notLike]: ""
            }
        }
    })

    return {
        rows: res,
        total
    }
}

const createUpdatePost = async (data) => {

}

const getDetailPost = async (data) => {

}

const deletePost = async (data) => {
    const check = await Post.findOne({
        where: {
            id: data.id,
            del: 0
        }
    })

    if (!check) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    return check.update({ del: 1 }, { where: { group_id: data.id } })
}

//PostCategory
const getListPostCategory = async (data) => {
    const { page, limit, name } = data

    const paging = Paging(page, limit)

    let where = { del: 0 }

    if (name) {
        where = {
            ...where,
            name: {
                [Op.like]: `%${name}%`
            }
        }
    }

    const res = await PostCategory.findAll({
        where: {
            ...where
        },
        ...paging,
        order: [['createdAt', 'desc']],
        attributes: {
            exclude: ['del', 'createdAt', 'updatedAt']
        }
    })

    const total = await PostCategory.count({
        where: {
            ...where
        }
    })

    return {
        rows: res,
        total
    }
}

const createUpdatePostCategory = async (data) => {
    if (data.id) {
        const check = await PostCategory.findOne({
            where: {
                id: data.id,
                del: 0
            }
        })

        if (!check) {
            throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
        }

        const check_name = await PostCategory.findOne({
            where: {
                name: data.name,
                id: {
                    [Op.ne]: data.id
                },
                status: 1,
                del: 0
            }
        })

        if (check_name) {
            throw new Error(ERROR_MESSAGE.INVALID_CREATE_CATEGORY)
        }

        return check.update({ ...data, del: 0 })
    } else {
        const check = await PostCategory.findOne({
            where: {
                name: data.name,
                status: 1,
                del: 0
            }
        })

        if (check) {
            throw new Error(ERROR_MESSAGE.INVALID_CREATE_CATEGORY)
        }

        return PostCategory.create({ ...data, del: 0 })
    }
}

const deletePostCategory = async (id) => {
    const check = await PostCategory.findOne({
        where: {
            id: id,
            del: 0
        }
    })

    if (!check) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    return check.update({ del: 1 })
}

//PostTag
const getListPostTag = async (data) => {
    const { page, limit, name } = data
    const paging = Paging(page, limit)
    let where = { del: 0 }

    if (name) {
        where = {
            ...where,
            name: {
                [Op.like]: `%${name}%`
            }
        }
    }

    const res = await PostTag.findAll({
        where: {
            ...where
        },
        ...paging,
        order: [['createdAt', 'desc']],
    })

    const total = await PostTag.count({
        where: {
            ...where
        }
    })

    return {
        rows: res,
        total
    }
}

const createUpdatePostTag = async (data) => {
    if (data.id) {
        const check = await PostTag.findOne({
            where: {
                id: data.id,
                del: 0
            }
        })
        if (!check) {
            throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
        }

        const check_name = await PostTag.findOne({
            where: {
                name: data.name,
                id: {
                    [Op.ne]: data.id
                },
                del: 0
            }
        })

        if (check_name) {
            throw new Error(ERROR_MESSAGE.INVALID_CREATE_CATEGORY)
        }

        return check.update({ ...data, del: 0 })
    } else {
        const check_name = await PostTag.findOne({
            where: {
                name: data.name,
                del: 0
            }
        })

        if (check_name) {
            throw new Error(ERROR_MESSAGE.INVALID_CREATE_CATEGORY)
        }

        return PostTag.create({ ...data, del: 0 })
    }
}

const deletePostTag = async (id) => {
    const check = await PostTag.findOne({
        where: {
            id: id,
            del: 0
        }
    })

    if (!check) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    return check.update({ del: 1 })
}

module.exports = {
    getListPost,
    createUpdatePost,
    getDetailPost,
    deletePost,
    getListPostCategory,
    createUpdatePostCategory,
    deletePostCategory,
    getListPostTag,
    createUpdatePostTag,
    deletePostTag
}

