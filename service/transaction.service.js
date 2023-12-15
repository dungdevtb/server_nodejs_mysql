const { createMomoPayment } = require("../config/momo/momo.api");
const { randomTransactionId } = require("../config/momo/random")

var partnerCode = process.env.PARTNER_CODE_MOMO//Định danh duy nhất của tài khoản M4B của bạn
var accessKey = process.env.ACCESS_KEY_MOMO;//Mã cấp quyền truy cập vào hệ thống MoMo.
var secretkey = process.env.SECRET_KEY_MOMO;//Dùng để tạo chữ ký điện tử digital signature.

const createATMMomoFastPayment = async (user_id, dataRequest, type) => {
    const { amount } = dataRequest
    const transaction_id = randomTransactionId('MOMOATM')
    var requestId = partnerCode + new Date().getTime();
    var orderId = transaction_id
    var orderInfo = 'Momo payment';
    var redirectUrl = ''//sd để chuyển trang từ momo về trang mua hàng sau khi khách hàng thanh toán 
    var ipnUrl = `${process.env.API_SERVER}/app/payment/callback-status-payment-by-momo`
    //ipnUrl: momo sd để gửi kết quả thanh toán theo phương thức IPN (server-to-server)
    var extraData = ''
    var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        amount +
        '&extraData' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType' +
        type;

    const crypto = require('crypto')
    var signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

    const requestBody = {
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: type,
        signature: signature,//để xác nhận giao dịch
        lang: 'vi'
    }

    try {
        const resp = await createMomoPayment(requestBody)
        return resp
    } catch (err) {
        throw err
    }
}

module.exports = {
    createATMMomoFastPayment
}