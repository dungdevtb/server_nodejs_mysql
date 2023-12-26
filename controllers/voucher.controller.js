const { voucherServices } = require("../service");

const getListVouchers = async (req) => {
    return await voucherServices.getListVouchers(req.query);
}

const getVoucherById = async (req) => {
    const id = req.params.id;
    return await voucherServices.getVoucherById(id);
}

const createUpdateVoucher = async (req) => {
    return await voucherServices.createUpdateVoucher(req.body);
}

const deleteVoucher = async (req) => {
    const id = req.params.id;
    return await voucherServices.deleteVoucher(id);
}

module.exports = {
    getListVouchers,
    getVoucherById,
    createUpdateVoucher,
    deleteVoucher,
}
