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

const deleteCustomer = async (req, res) => {
    const { id } = req.query;
    return customerServices.deleteCustomer(id);
};

const exportListCustomer = async (req, res) => {
    return customerServices.exportListCustomer(req, res);
}

module.exports = {
    login,
    register,
    getListCustomer,
    updateCustomer,
    deleteCustomer,
    exportListCustomer
}