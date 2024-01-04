const { orderServices } = require('../service');

const getListOrder = async (req, res) => {
    return orderServices.getListOrder(req.query)
}

const updateStatusOrder = async (req, res) => {
    return orderServices.updateStatusOrder(req.body)
}

const newOrder = async (req, res) => {
    return orderServices.newOrder(req.body)
}

module.exports = {
    getListOrder,
    updateStatusOrder,
    newOrder
}

