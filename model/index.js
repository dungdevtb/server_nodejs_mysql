const Tutorial = require("./tutorial.model");

const { sequelize } = require("../config/db.config");

Tutorial.sync();

for (const m in sequelize.models) {
  sequelize.models[m].association();
}

module.exports = {
  Tutorial,
};
