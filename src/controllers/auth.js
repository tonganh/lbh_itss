const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { registerMiddleware } = require("../middlewares/registerMiddleware");
const { loginMiddleware } = require("../middlewares/loginMiddleware");
const { models } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const router = Router();

router.post("/register", registerMiddleware, async (req, res) => {
  const { username, password, email } = req.body;
  const { User } = models;
  const foundUser = await User.findOne({
    where: {
      [Op.or]: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  });
  if (foundUser) {
    return res.status(400).send("User already exists");
  }
  const newUser = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  return res.status(201).send({
    id: newUser.id,
  });
});

router.post("/login", loginMiddleware, async (req, res) => {
  const { user, password } = req.body;
  const { User } = models;
  const found = await User.findOne({
    where: {
      [Op.or]: [
        {
          username: user,
        },
        {
          email: user,
        },
      ],
    },
  });
  if (!found) {
    return res.status(401);
  }
  const isPasswordCorrect = bcrypt.compareSync(password, found.password);
  if (!isPasswordCorrect) {
    return res.status(401);
  }
  const token = jwt.sign(
    { id: found.id, username: found.username, email: found.username },
    process.env.JWT_SECRET
  );
  return res.status(200).send({ token });
});

module.exports = router;
