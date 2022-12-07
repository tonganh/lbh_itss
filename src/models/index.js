const Sequelize = require("sequelize");

const getUserModel = require("./user");
const getTaskModel = require("./task");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
  }
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Task: getTaskModel(sequelize, Sequelize),
};

module.exports = {
  sequelize,
  models,
};
