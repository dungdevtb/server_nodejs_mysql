const asyncHandler = require("express-async-handler");
const { User, UserRole, Role } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _CONF = require("../config/auth.config");
const { checkPassword, hashPassWord, generateToken } = require("../middleware/auth");
const { Paging } = require("../config/paging");
const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { getListPermissionByRoleId } = require("./permission.service");
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
      del: 0
    },
    attributes: {
      exclude: ['del', 'createdAt', 'updatedAt']
    },
    include: [{
      model: UserRole,
      as: 'user_role',
      required: false,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'del']
      },
      include: [{
        model: Role,
        as: 'role',
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'del']
        }
      }]
    }]
  });

  if (!user) {
    throw new Error(ERROR_MESSAGE.NOT_FOUND_ACCOUNT);
  }

  ////compare password vs hashPassWord
  //so sánh pass ng dung nhập vs hashPass trong db
  if (user && (await bcrypt.compare(password, user.password))) {
    //jwt gồm :<base64-encoded header>.<base64-encoded payload>.<base64-encoded signature>

    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    const accessToken = jwt.sign(
      {
        //truyền vào payload
        userid: user.id
        // user: {
        //   username: user.username,
        //   email: user.email,
        //   id: user.id,
        // },
      },
      _CONF.SECRET,
      { expiresIn: _CONF.tokenLife } //token sẽ hết hạn 
    );
    const refreshToken = jwt.sign(
      {
        //truyền vào payload
        userid: user.id
        // user: {
        //   username: user.username,
        //   email: user.email,
        //   id: user.id,
        // },
      },
      _CONF.SECRET_REFRESH,
      { expiresIn: _CONF.refreshTokenLife }
    );

    const check_role = await UserRole.findOne({
      where: {
        user_id: user.id
      }
    })

    const list_permission = check_role ? await getListPermissionByRoleId(check_role.role_id) : [];

    return {
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        status: user.status,
        avatar: user.avatar,
      },
      list_permission: list_permission
    };
  } else {
    return {
      status: 401,
      message: "Email or password is not valid",
    };
  }
});

const getProfile = asyncHandler(async (userid) => {
  const accExist = await User.findOne({
    where: {
      id: userid,
      del: 0
    },
  });

  if (!accExist) {
    throw new Error("Token invalid!");
  }

  const check_role = await UserRole.findOne({
    where: {
      user_id: accExist.id
    }
  })

  const list_permission = check_role ? await getListPermissionByRoleId(check_role.role_id) : [];

  return {
    user: {
      id: accExist.id,
      username: accExist.username,
      email: accExist.email,
      mobile: accExist.mobile,
      address: accExist.address,
      status: accExist.status,
      avatar: accExist.avatar,
    },
    list_permission: list_permission,
    token: await generateToken({ userid: accExist.id })
  }
});


const updateProfile = asyncHandler(async (data) => {
  const accExist = await User.findOne({
    where: {
      id: data.id,
      del: 0
    },
  });

  if (!accExist) {
    throw new Error("User not found!");
  } else {
    await accExist.update({
      email: data.email,
      username: data.username
    })
  }

  return accExist
})

const changePassword = asyncHandler(async (data) => {
  const existAccount = await User.findOne({
    where: {
      id: data.id,
      del: 0
    }
  })

  if (!existAccount) {
    throw new Error("Token invalid!")
  } else {
    const isValidOld = await checkPassword(data.old_password, existAccount.password)
    if (!isValidOld) {
      throw new Error("Sai mật khẩu hiện tại.")
    }
    const isValidPass = await checkPassword(data.new_password, existAccount.password)
    if (isValidPass) {
      throw new Error("Mật khẩu mới phải khác mật khẩu cũ.")
    } else {
      await existAccount.update({
        password: hashPassWord(data.new_password)
      })
    }
  }

  const token = await generateToken({ id: existAccount.id, check: true, password: existAccount.password.substring(42) });

  return { token }
})

const getListUser = asyncHandler(async (req, res) => {
  const paging = Paging(req.page, req.limit);
  let where = {
    del: 0
  }

  if (req.username && req.username !== "") {
    where.username = {
      [Op.like]: `%${req.username}%`
    }
  }

  if (req.email && req.email !== "") {
    where.email = {
      [Op.like]: `%${req.email}%`
    }
  }

  const users = await User.findAll({
    where: {
      ...where
    },
    attributes: {
      exclude: ['password', 'del', 'createdAt', 'updatedAt']
    },
    include: [
      {
        model: UserRole,
        as: 'user_role',
        required: false,
        attributes: ['user_id', 'role_id'],
        where: {
          del: 0
        },
        include: [
          {
            model: Role,
            as: 'role',
            required: false,
            attributes: ['id', 'name', 'slug'],
            where: {
              del: 0
            }
          }
        ]
      }
    ],
    ...paging,
    order: [['createdAt', 'desc']],
  });

  const total = await User.count({
    where: {
      ...where
    }
  })

  return {
    rows: users,
    total: total
  }
})

const updateUser = async (data) => {
  if (data.id) {
    const check = await User.findOne({
      where: {
        id: data.id,
        del: 0
      }
    })

    if (!check) {
      throw new Error("User not found!")
    }

    const checkEmail = await User.findOne({
      where: {
        id: {
          [Op.notLike]: data.id
        },
        email: {
          [Op.like]: `%${data.email}%`
        },
        del: 0
      }
    })

    if (checkEmail) {
      throw new Error('Email already exists')
    }

    if (data.password && data.password != '') {
      data.password = hashPassWord(data.password)
    }

    const update = await check.update({ ...data })

    const check_role = await UserRole.findOne({
      where: {
        user_id: check.id
      }
    })

    if (!check_role) {
      await UserRole.create({
        user_id: check.id,
        role_id: data.role_id,
        del: 0
      })
    } else {
      await check_role.update({
        user_id: check.id,
        role_id: data.role_id
      })
    }
    return update
  } else {
    const accExist = await User.findOne({
      where: {
        email: {
          [Op.like]: `%${data.email}%`
        },
        del: 0
      }
    })

    if (accExist) {
      throw new Error("Email already exists")
    }

    const create = await User.create({
      ...data,
      password: hashPassWord(data.password),
      del: 0
    })

    await UserRole.create({
      user_id: create.id,
      role_id: data.role_id,
      del: 0
    })

    return create
  }
}


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getListUser,
  updateUser
};
