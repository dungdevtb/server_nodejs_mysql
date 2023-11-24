const { crawlServices } = require('../service')

const getDataCrawl = async (req, res) => {
    const data = req.query
    return crawlServices.getDataCrawl()
}

module.exports = {
    getDataCrawl
}