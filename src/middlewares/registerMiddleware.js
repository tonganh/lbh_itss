const yup = require("yup");

const schema = yup.object().shape({
  username: yup.string().required().max(255),
  password: yup.string().required().max(255),
  email: yup.string().email().required().max(255),
});

module.exports.registerMiddleware = (req, res, next) => {
  try {
    schema.validateSync(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.errors);
  }
};
