const yup = require("yup");

const schema = yup.object().shape({
  user: yup.string().required().max(255),
  password: yup.string().required().max(255),
});

module.exports.loginMiddleware = (req, res, next) => {
  try {
    schema.validateSync(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.errors);
  }
};
