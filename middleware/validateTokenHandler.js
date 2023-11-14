const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  //lấy phần Authorization của header = Bearer accessToken
  // let authHeader = req.headers.Authorization || req.headers.authorization;

  let authHeader = req.headers.token;
  console.log(authHeader, "authHeader", process.env.ACCESS_TOKEN_SECRET);

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; //;gán token = accessToken vì split('')[0]=Bearer

    //jwt.verify(token, secretOrPublicKey, [options, callback]) - xác minh token nhận dk khi ng dùng truyền vào
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      //   console.log(decoded);
      req.user = decoded.user;
      next();
    });

    console.log(
      token,
      "tokennnnnnnnnnnnnnnnnnn",
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  }
});

module.exports = validateToken;
