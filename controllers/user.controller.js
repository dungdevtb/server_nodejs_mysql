const { userServices } = require("../service");

const login = async (req, res) => {
  return userServices.login(req, res);
};

const register = async (req, res) => {
  return userServices.register(req, res);
};

const profile = async (req, res) => {
  return userServices.profile(req, res);
};

module.exports = {
  login,
  register,
  profile,
};
