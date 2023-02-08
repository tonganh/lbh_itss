const jwt = require("jsonwebtoken");

module.exports.authMiddleware = (req, res, next) => {
  console.log('123');
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).send("無許可");
  }

  const [_, token] = authorization.split(" ");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("🚀 ~ file: authMiddleware.js:14 ~ req.user", req.user)
    next();
  } catch (err) {
    return res.status(403).send("無許可");
  }
};