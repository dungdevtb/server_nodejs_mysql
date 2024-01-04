const randomTransactionId = (strType = '', l = 8) => {
    return strType + randomOTP(l)
}

const randomOTP = (l = 6) => {
    const chars = '0123456789';
    const charsLength = chars.length;
    let string = '';

    for (let i = 0; i < l; i++)
        string += chars.charAt(Math.floor(Math.random() * charsLength));

    return string;
}


module.exports = {
    randomTransactionId
}