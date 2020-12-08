const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    const decode = jwt.verify(token, config.jwtKey);
    req.user = decode.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send('Invalid Token');
  }
};
