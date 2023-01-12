const CronJob = require("cron").CronJob;
const nodemailer = require("nodemailer");
const { models } = require("./models");
const { Op } = require("sequelize");

const configOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

module.exports.createDailyJob = () => {
  const job = new CronJob(
    "0 23 10 * * *",
    function () {
      console.log("Running Send Mail Job");
      const { Task, User } = models;
      User.findAll().then((users) => {
        let content = "";
        users.forEach((user) => {
          Task.findAll({
            where: {
              user_id: user.id,
              start_time: {
                [Op.and]: {
                  [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                  [Op.lte]: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            },
          }).then((tasks) => {
            tasks.forEach((task) => {
              content += `Title: ${task.title}\nDescription: ${task.description}\nStart time: ${task.start_time}\npriority: ${task.priority}\nprogress: ${task.progress}\n`;
            });
            if (content) {
              module.exports.sendMail(
                user.email,
                "Sunflower ITSS - Today's tasks",
                content
              );
            }
          });
        });
      });
    },
    null,
    true,
    "Asia/Ho_Chi_Minh"
  );
  job.start();
};

module.exports.sendMail = (email, subject, content) => {
  const transporter = nodemailer.createTransport(configOptions);
  const mailOptions = {
    from: "Sunflower ITSS",
    to: email,
    subject,
    text: content,
  };

  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
