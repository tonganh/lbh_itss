const yup = require("yup");

const schema = yup.object().shape({
  title: yup.string().required().max(255),
  content: yup.string().required().max(5000),
  deadline: yup.date().required(),
  status: yup.string(),
  progress: yup.number(),
});

module.exports.createTaskMiddleware = (req, res, next) => {
  try {
    schema.validateSync(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.errors);
  }
};
