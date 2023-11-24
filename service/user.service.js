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
    throw new Error("User already registered!");
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

  // console.log(`User created ${user}`);
  // if (user) {
  //   res.status(201).json({ _id: user.id, email: user.email });
  // } else {
  //   res.status(400);
  //   throw new Error("User data us not valid");
  // }
  // res.json({ message: "Register user" });
  return user;
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
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" } //token sẽ hết hạn trong 10phut
    );

    // res.status(200).json({ accessToken });
    return { accessToken: accessToken };
  } else {
    // res.status(401);
    // throw new Error("Email or password is not valid");
    return {
      status: 401,
      message: "Email or password is not valid",
    };
  }
});

const profile = asyncHandler(async (req, res) => {
  // res.json({ message: "Profile user" });
  // const User
  return {
    message: "Profile user",
  };
});

module.exports = { register, login, profile };
