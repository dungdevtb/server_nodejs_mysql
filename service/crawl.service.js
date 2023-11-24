const cheerio = require("cheerio");
const request = require('request-promise')
const { Crawl } = require('../model')

//createDataCrawl auto
const createCrawlData = async () => {
    let data = []
    await request('https://123job.vn/tuyen-dung', (err, res, html) => {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html)

            $('.job__list-item').each((index, item) => {
                const job = $(item).find('.job__list-item-title a').text();
                const company = $(item).find('.job__list-item-company span').text();
                const address = $(item).find('.job__list-item-info').find('.address').text();
                const salary = $(item).find('.job__list-item-info').find('.salary').text();

                data.push({
                    job,
                    company,
                    address,
                    salary
                })
            })
        } else {
            console.log(err)
        }
    })


    await Promise.all(data.map(async (item) => {
        if (item?.job && item?.company && item?.address && item?.salary) {
            await Crawl.create({
                job: item?.job,
                company: item?.company,
                address: item?.address,
                salary: item?.salary
            })
        }
    }))

    return data
}

const getDataCrawl = async () => {
    const dataCrawl = await Crawl.findAll()
    const count = await Crawl.count()
    return {
        dataCrawl: dataCrawl,
        total: count
    }
}

module.exports = {
    createCrawlData,
    getDataCrawl
}