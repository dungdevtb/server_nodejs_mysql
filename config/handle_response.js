const { ERROR_MESSAGE } = require("./error");

const Response = (handel) => {
  return async (req, res, next) => {
    try {
      const data = await handel(req, res, next);
      return res.send({
        message: "Thành công !",
        statusCode: 200,
        data: data,
      });
    } catch (err) {
      const code = err && err.message ? err.message : ERROR_MESSAGE.ERROR;
      let message = ERROR_MESSAGE[code]
        ? ERROR_MESSAGE[code]
        : ERROR_MESSAGE.ERR_0000;
      if (typeof message !== "string") {
        message = ERROR_MESSAGE.ERR_0000;
      }
      return res.send({
        statusCode: 400,
        message: code ? code : ERROR_MESSAGE.ERROR,
      });
    }
  };
};

module.exports = { Response };
