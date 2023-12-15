const { ERROR_MESSAGE } = require("../config/error");
const { transactionServices } = require("../service");


const createATMMomoFastPayment = async (req, res, next) => {
    const userid = req.userToken || req.body.userid || 0;
    const type = 'payWithATM';
    try {
        const resp = await transactionServices.createATMMomoFastPayment(userid, req.body, type);
        //resultCode = 0: giao dịch thành công.
        //resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
        //resultCode <> 0: giao dịch thất bại.
        if (resp?.resultCode === 0) {
            console.log({
                user_id: userid,
                amount: resp.amount,
                status: 0,
                description: '',
                request_id: resp.requestId,
                transaction_id: resp.orderId
            })
        }
        return res.send({
            signal: 1,
            code: 200,
            data: resp,
            message: 'Thanh toán thành công'
        })
    } catch (err) {
        console.log('Error CreateMomoPayment ===> ', err);
        console.log(req.originalUrl);

        return res.send({
            signal: 0,
            code: 400,
            errorCode: ERROR_MESSAGE.ERROR_PAYMENT,
            message
        })
    }
}

module.exports = {
    createATMMomoFastPayment
}