const { postServices } = require('../service');

//Post
const getListPost = async (req, res) => {
    return postServices.getListPost(req.query);
}

const createUpdatePost = async (req, res) => {
    const { userid } = req.userToken;
    return postServices.createUpdatePost(req.body, userid);
}

const getDetailPost = async (req, res) => {
    const { id } = req.params;
    return postServices.getDetailPost(id);
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    return postServices.deletePost(id);
}
//PostCategory
const getListPostCategory = async (req, res) => {
    return postServices.getListPostCategory(req.query);
}

const createUpdatePostCategory = async (req, res) => {
    return postServices.createUpdatePostCategory(req.body);
}

const deletePostCategory = async (req, res) => {
    const { id } = req.params;
    return postServices.deletePostCategory(id);
}

//PostTag
const getListPostTag = async (req, res) => {
    return postServices.getListPostTag(req.query);
}

const createUpdatePostTag = async (req, res) => {
    return postServices.createUpdatePostTag(req.body);
}

const deletePostTag = async (req, res) => {
    const { id } = req.params;
    return postServices.deletePostTag(id);
}

//***********post webbb******** */
const getListPostWeb = async (req, res) => {
    return postServices.getListPostWeb(req.query);
}

const getPostHot = async (req, res) => {
    return postServices.getPostHot();
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
