const { customerServices } = require("../service");

const login = async (req, res) => {
    return customerServices.login(req, res);
};

const register = async (req, res) => {
    return customerServices.register(req, res);
};

const getListCustomer = async (req, res) => {
    return customerServices.getListCustomer(req.query);
}

const updateCustomer = async (req, res) => {
    return customerServices.updateCustomer(req.body);
}

const getDetailCustomer = async (req, res) => {
    return customerServices.getDetailCustomer(req.query);
}

const updateAddressWeb = async (req, res) => {
    return customerServices.updateAddressWeb(req.body);
}

const deleteCustomer = async (req, res) => {
    const { id } = req.query;
    return customerServices.deleteCustomer(id);
};

const exportListCustomer = async (req, res) => {
    return customerServices.exportListCustomer(req, res);
}

const createComment = async (req, res) => {
    return customerServices.createComment(req.body);
}

module.exports = {
    login,
    register,
    getListCustomer,
    updateCustomer,
    getDetailCustomer,
    updateAddressWeb,
    deleteCustomer,
    exportListCustomer,
    createComment
}