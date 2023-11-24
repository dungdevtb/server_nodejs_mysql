const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const _CONF = require("../config/auth.config");



const checkToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['token']

  //decode token
  if (token) {
    //verifies secret and checks exp
    jwt.verify(token, _CONF.SECRET, (err, decoded) => {
      if (err) {
        console.error(err.toString());
        return res.status(401).json({ "error": true, "message": "Unauthorized access", err });
      }
      req.decoded = decoded;
      next();
    })
  } else {
    return res.status(403).send({
      "error": true,
      "message": "No token provided!"
    });
  }
}

module.exports = { checkToken };
