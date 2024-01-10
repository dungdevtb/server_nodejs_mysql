const { orderServices } = require('../service');

const getListOrder = async (req, res) => {
    return orderServices.getListOrder(req.query)
}

const getDetailOrder = async (req, res) => {
    return orderServices.getDetailOrder(req.query)
}

const updateStatusOrder = async (req, res) => {
    return orderServices.updateStatusOrder(req.body)
}

const newOrder = async (req, res) => {
    return orderServices.newOrder(req.body)
}

const exportListOrder = async (req, res) => {
    return orderServices.exportListOrder(req, res)
}

module.exports = {
    getListOrder,
    getDetailOrder,
    updateStatusOrder,
    newOrder,
    exportListOrder
}

