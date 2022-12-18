const yup = require("yup");

const schema = yup.object().shape({
  title: yup.string().required().max(255),
  description: yup.string().max(255),
  content: yup.string().required().max(5000).required(),
  priority: yup.mixed().oneOf(['低い', '中', '高い']),
  start_time: yup.string().required(),
  progress: yup.mixed().oneOf(['0', '20', '50', '80', '100']),
  status: yup.mixed().oneOf(['トド', '進行中', 'ペンディング', '完了']),
  user_id: yup.number().required().positive().integer()
});

module.exports.createTaskMiddleware = (req, res, next) => {
  try {
    schema.validateSync(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.errors);
  }
};
