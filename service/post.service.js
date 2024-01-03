const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");
const { changeToSlug, slugify } = require("../config/utils")

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
    if (data.id) {
        const check = await Post.findOne({
            where: {
                id: data.id,
                del: 0
            }
        })

        if (!check) {
            throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
        }

        let list_tag = []

        if (data.tag && data.tag.length > 0) {
            list_tag = await checkTag(data.tag, check.id)
        }

        data.seo_url = data.seo_url || changeToSlug(data.title) || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const checkUrl = await Post.findOne({
            where: {
                seo_url: data.seo_url,
                id: {
                    [Op.ne]: data.id
                }
            }
        })

        if (checkUrl) {
            data.seo_url = data.seo_url + '-' + checkUrl.id + '-' + Math.random().toString(36).substring(2, 5);
        }

        const update = await check.update({ ...data })

        return {
            ...update.toJSON(),
            list_tag
        }
    } else {
        let list_tag = []
        data.seo_url = data.seo_url || changeToSlug(data.title)
        const checkUrl = await Post.findOne({
            where: {
                seo_url: data.seo_url
            }
        })

        if (checkUrl) {
            data.seo_url = data.seo_url + '-' + checkUrl.id + '-' + Math.random().toString(36).substring(2, 5);
        }

        let create = await Post.create({ ...data, del: 0 })

        create.toJSON()

        if (data.tag && data.tag.length > 0) {
            list_tag = await checkTag(data.tag, create.id)
        }

        return {
            ...create,
            list_tag
        }
    }
}

const getDetailPost = async (data) => {
    const check = await Post.findOne({
        where: {
            id: data.id,
            del: 0
        }
    })

    if (!check) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    return check
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

    // return check.update({ del: 1 }, { where: { group_id: data.id } })
    return check.update({ del: 1 })
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
const checkTag = async (tag, post_id) => {
    await PostHookTag.destroy({
        where: {
            post_id: post_id
        }
    })

    const list_tag = tag.map(async (item) => {
        const data = {
            name: item.trim(),
            slug: slugify(item),
            del: 0
        }

        const check = await PostTag.findOne({
            where: {
                name: item.trim(),
                slug: slugify(item),
                del: 0
            }
        })

        if (check) {
            if (!(item == check.name)) {
                throw new Error('Nhãn bài viết đã tồn tại!')
            }

            const data_post_tag = {
                post_id: post_id,
                tag_id: check.id
            }
            PostHookTag.create(data_post_tag)
        } else {
            const check_create = PostTag.findOne({
                where: {
                    slug: slugify(item),
                    del: 0
                }
            })

            if (check_create) {
                throw new Error('Nhãn bài viết đã tồn tại!')
            }

            const tagCreated = await PostTag.create(data)
            const data_post_tag = {
                post_id: post_id,
                tag_id: tagCreated.id
            }

            PostHookTag.create(data_post_tag)
        }
    })

    await Promise.all(list_tag)

    const listTag = await PostHookTag.findAll({
        where: {
            post_id: post_id
        },
        include: [
            {
                model: PostTag,
                as: 'tag',
                required: true,
                attributes: ['id', 'name']
            }
        ]
    })

    return listTag
}

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

//***********post webbb******** */
const getListPostWeb = async (data) => {
    const { title } = data
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
            ...where
        },
        order: [['display_order', 'asc']],
        attributes: {
            exclude: ['del', 'createdAt', 'updatedAt']
        }
    })

    return res
}

const getPostHot = async () => {
    const res = await Post.findAll({
        where: {
            hot: 1,
            del: 0
        },
        limit: 5,
        order: [['createdAt', 'desc']],
    })
    return res
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
    deletePostTag,
    getListPostWeb,
    getPostHot
}

