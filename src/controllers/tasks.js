const { Router } = require("express");
const { models } = require("../models");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createTaskMiddleware } = require("../middlewares/createTaskMiddleware");

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const { Task } = models;
  const tasks = await Task.findAll({
    where: {
      user_id: req.user.id,
    },
  });
  return res.status(200).send(tasks);
});

router.post("/", authMiddleware, createTaskMiddleware, async (req, res) => {
  const { Task } = models;
  const { title, content, deadline, status, progress } = req.body;
  const task = await Task.create({
    title,
    content,
    deadline,
    status: status || "pending",
    progress: progress || 0,
    user_id: req.user.id,
  });
  return res.status(201).send(task);
});

router.put("/:id", authMiddleware, createTaskMiddleware, async (req, res) => {
  const { Task } = models;
  const { id } = req.params;
  const { title, content, deadline, status, progress } = req.body;
  const task = await Task.findOne({
    where: {
      id,
      user_id: req.user.id,
    },
  });
  if (!task) {
    return res.status(404).send("Task not found");
  }
  task.title = title;
  task.content = content;
  task.deadline = deadline;
  task.status = status || "pending";
  task.progress = progress || 0;
  await task.save();
  return res.status(200).send(task);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { Task } = models;
  const { id } = req.params;
  const task = await Task.findOne({
    where: {
      id,
      user_id: req.user.id,
    },
  });
  if (!task) {
    return res.status(404).send("Task not found");
  }
  await task.destroy();
  return res.status(200).send("Task deleted");
});

module.exports = router;
