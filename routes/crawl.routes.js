const { CrawlController } = require('../controllers')
const Router = require('express')
const { Response } = require('../config/handle_response')

const svRouter = new Router()

svRouter.get('/get_crawl_data', Response(CrawlController.getDataCrawl))

module.exports = svRouter