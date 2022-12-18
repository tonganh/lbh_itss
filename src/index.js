require("dotenv").config();
const express = require("express");
const authController = require("./controllers/auth");
const tasksController = require("./controllers/tasks");
const { sequelize } = require("./models");

const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use("/auth", authController);
app.use("/tasks", tasksController);

sequelize.authenticate().then(() => {
  sequelize.sync();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
