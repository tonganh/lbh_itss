const Sequelize = require("sequelize");

const getUserModel = require("./user");
const getTaskModel = require("./task");

const sequelize = new Sequelize(
  "sunflower",
  "admin",
  "admin",
  {
    host: "0.0.0.0",
    dialect: "sqlite",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    storage: "./db/database.sqlite"
  }
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Task: getTaskModel(sequelize, Sequelize),
};

module.exports = {
  sequelize,
  models
}
