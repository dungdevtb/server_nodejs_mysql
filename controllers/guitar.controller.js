const { guitarServices } = require("../service");

const getListGuitar = async (req, res) => {
    const data = req.query;
    return guitarServices.getListGuitar(data);
};

// const getBrandById = async (req, res) => {
//     const { id } = req.params;
//     return guitarServices.getBrandById(id);
// };

const createUpdateGuitar = async (req, res) => {
    const data = req.body;
    return guitarServices.createUpdateGuitar(data);
}

const deleteGuitar = async (req, res) => {
    const { id } = req.params;
    return guitarServices.deleteGuitar(id);
}

const exportListGuitar = async (req, res) => {
    return guitarServices.exportListGuitar(req, res);
}

module.exports = {
    getListGuitar,
    createUpdateGuitar,
    deleteGuitar,
    exportListGuitar
}