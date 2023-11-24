const asyncHandler = require("express-async-handler");
const { User } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _CONF = require("../config/auth.config");
require("dotenv").config();

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All feilds are mandatory!");
  }

  //check user tồn tại qua trường email vì email là duy nhất
  const userAvailable = await User.findOne({
    where: {
      email: email,
    },
  });
  if (userAvailable) {
    res.status(400);
    throw new Error("User has registered for this email!");
  }

  //register: Tạo User ms
  //hashPassword
  const hashPassword = await bcrypt.hash(password, 10);
  // console.log("Password then hash ===>", hashPassword);
  const user = await User.create({
    username: username,
    email: email,
    password: hashPassword,
  });

  return {
    message: "User created successfully!",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  };
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All feilds are mandatory");
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  ////compare password vs hashPassWord
  //so sánh pass ng dung nhập vs hashPass trong db
  if (user && (await bcrypt.compare(password, user.password))) {
    //jwt gồm :<base64-encoded header>.<base64-encoded payload>.<base64-encoded signature>

    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    const accessToken = jwt.sign(
      {
        //truyền vào payload
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      // process.env.ACCESS_TOKEN_SECRET,
      _CONF.SECRET,
      { expiresIn: _CONF.tokenLife } //token sẽ hết hạn 
    );
    const refreshToken = jwt.sign(
      {
        //truyền vào payload
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      _CONF.SECRET_REFRESH,
      { expiresIn: _CONF.refreshTokenLife }
    );

    return {
      token: accessToken,
      refreshToken: refreshToken
    };
  } else {
    return {
      status: 401,
      message: "Email or password is not valid",
    };
  }
});

const profile = asyncHandler(async (req, res) => {
  const { id } = req.query
  const user = await User.findOne({
    where: {
      id: id,
    },
  });
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    message: "Profile user",
  };
});

module.exports = { register, login, profile };
