import Sequelize from "sequelize";

import getUserModel from "./user";
import getTaskModel from "./task";

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "postgres",
  }
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Task: getTaskModel(sequelize, Sequelize),
};

export { sequelize };

export default models;
