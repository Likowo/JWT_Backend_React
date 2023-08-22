const jwt = require('jsonwebtoken');

// Middleware function is a function that has access to the req, res cycle/object. next is used to pass on to next portion of middleware

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, Auth denied' });
  }

  // Verify token if there is one
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};