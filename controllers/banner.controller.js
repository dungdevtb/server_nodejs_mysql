const { bannerServices } = require("../service");

const getListBanner = async (req) => {
    return await bannerServices.getListBanner(req.query);
}

const createUpdateBanner = async (req) => {
    return await bannerServices.createUpdateBanner(req.body);
}

const deleteBanner = async (req) => {
    const id = req.params.id;
    return await bannerServices.deleteBanner(id);
}

module.exports = {
    getListBanner,
    createUpdateBanner,
    deleteBanner
}
