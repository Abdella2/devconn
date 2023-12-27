const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .json({ errors: [{ msg: 'No token, Authorization denied' }] });

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(400).json({ errors: [{ msg: 'Invalid token' }] });
  }
};
