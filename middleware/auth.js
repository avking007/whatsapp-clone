const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send('Invalid Token');
  }
};
