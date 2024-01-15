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

const addToCart = async (req, res) => {
    return orderServices.addToCart(req.body)
}

const removeFromCart = async (req, res) => {
    return orderServices.removeFromCart(req.body)
}

const getDetailCart = async (req, res) => {
    return orderServices.getDetailCart(req.query)
}
module.exports = {
    getListOrder,
    getDetailOrder,
    updateStatusOrder,
    newOrder,
    exportListOrder,
    getDetailCart,
    addToCart,
    removeFromCart
}

