const axios = require("axios");

const api = process.env.API_MOMO

const headers = {
    'Content-Type': 'application/json; charset=utf-8',
}

const createMomoPayment = (data) => {
    return Promise((resolve, reject) => {
        const url = `${api}/v2/gateway/api/create`;
        axios.post(url,
            {
                ...data
            },
            {
                headers
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                console.log("Error Momo ===> ", err);
                reject(err)
            })
    })
}

module.exports = {
    createMomoPayment
}


