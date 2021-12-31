const JWT = require('jsonwebtoken')
const globalConfig = require('@config/config');
const User = require('@models/user/users')

module.exports = async (req, res, next) => {
  
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) return res.status(401).json({
    status: false,
    message: "Access denied. No token provided."
  });
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).json({
    status: false,
    message: "Access denied. No token provided."
  });
  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = JWT.verify(token, globalConfig.secretKey);
    req.user = decoded;
    // , deviceId: req.body.deviceId
    const user = await User.findOne({ _id: req.user.id, token: token })
    if (!user) {
      // throw new Error()
      return res.status(401).json({
        status: false,
        message: "token expired"
      });
    }
    next();
  } catch (error) {
    console.trace(error);
    //if invalid token
    res.status(400).json({
      status: false,
      message: "Invalid token"
    });
  }
}