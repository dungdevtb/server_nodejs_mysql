require("dotenv").config();
const jwt = require("jsonwebtoken");
const _CONF = require("../config/auth.config");
const bcrypt = require('bcryptjs');

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

const hashPassWord = (password) => {
  if (!password) return '';

  return bcrypt.hashSync(password, 10);
}

const checkPassword = async (password, hashPass) => {
  if (!hashPass) {
    return false
  }

  return bcrypt.compare(password, hashPass);
}

const generateToken = async (data, secretKey = _CONF.SECRET, expiresIn = '30d') => {
  return jwt.sign(data, secretKey, { expiresIn });
}

module.exports = { checkToken, hashPassWord, checkPassword, generateToken };
