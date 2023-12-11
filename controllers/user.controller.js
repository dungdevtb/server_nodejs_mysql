const { userServices } = require("../service");

const login = async (req, res) => {
  return userServices.login(req, res);
};

const register = async (req, res) => {
  return userServices.register(req, res);
};

const getProfile = async (req, res) => {
  const { userid } = req.userToken;
  return userServices.getProfile(userid);
};
const updateProfile = async (req, res) => {
  const { data } = req.body
  return userServices.updateProfile(data);
};

const changePassword = async (req, res) => {
  const { data } = req.body
  return userServices.changePassword(data);
}

const getListUser = async (req, res) => {
  return userServices.getListUser(req.query); f
}

const updateUser = async (req, res) => {
  return userServices.updateUser(req.body);
}

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  getListUser,
  updateUser
};
