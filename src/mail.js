const CronJob = require("cron").CronJob;
const nodemailer = require("nodemailer");
const { models } = require("./models");
const { Op } = require("sequelize");
const axios = require('axios').default
const configOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

module.exports.createDailyJob = () => {
  const job = new CronJob(
    "0 0 8 * * *",
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

  const job2 = new CronJob(
    "* * * * *",
    async () => {
      const { Task, User } = models
      const listAllTask = await Task.findAll()
      await Promise.all(listAllTask.map(async (task) => {
        const { user_id, start_time, process, title, description, content } = task
        if (process === 100) {
          return
        }
        const presentTime = new Date().setSeconds(0, 0)
        const dateAfterFormatSecond = new Date(start_time).setSeconds(0, 0)
        const startTimeFormated = new Date(dateAfterFormatSecond)

        const diffMs = presentTime - dateAfterFormatSecond
        const diffMins = (diffMs) / 60000; // minutes
        console.log("???? ~ file: mail.js:67 ~ awaitPromise.all ~ diffMins", diffMins)
        const diffMinuteNeedSendMail = 16
        // const conditionSendMail = diffMins === diffMinuteNeedSendMail
        const conditionSendMail = diffMins === 15 || diffMins === 0
        if (conditionSendMail) {
          const userNeedSendMail = await User.findOne({
            where: {
              id: user_id
            }
          })
          const { email, name } = userNeedSendMail
          const remindTimeContent = diffMins === 0 ? '???? b??? qu?? h???n!' : 'Ch??? c??n 15 ph??t n???a l?? ?????n deadline r???i, nhanh c??i tay l??n b???n ??i!!!'
          const contentSendMail = `
            ${name} th??n m???n\
            ${remindTimeContent} \
            D?????i ????y l?? t??m t???t c??ng vi???c l??c 16h h??m nay c???a b???n:\
            - Nhi???m v??? c???a b???n l??: ${title}\
            - M?? t???: ${description}\
            - N???i dung: ${content}\
            - Th???i gian: ${startTimeFormated.getHours() + 1} gi??? ${startTimeFormated.getMinutes()} ph??t\
          `;
          try {
            const linkEmailUseForsend = 'https://itss-final-project.2soft.top/auth/support-lbh'
            const sendMailRes = await axios.post(linkEmailUseForsend, {
              email: email, content: contentSendMail
            })
            console.log("???? ~ file: mail.js:99 ~ awaitPromise.all ~ sendMailRes", sendMailRes)
          } catch (error) {
            console.log(error);
          }
        }
      }))
      console.log("Running Send Mail Job");
    },
    null,
    true,
    "Asia/Ho_Chi_Minh"
  );
  job2.start();
};

module.exports.sendMail = (email, subject, content) => {
  const transporter = nodemailer.createTransport(configOptions);
  console.log("???? ~ file: mail.js:98 ~ configOptions", configOptions)
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
