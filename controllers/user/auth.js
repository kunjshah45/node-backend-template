const Users = require("@models/user/users");
var bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const globalConfig = require("@config/config");

const config = require("@config/mainConfig");

const mongoose = require("mongoose");
// const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;
const Responder = require("@service/responder");

exports.signin = async (req, res) => {
    try {
      let userInfo = await Users.findOne({
        email: req.body.email.toLowerCase().trim(),
      });
      if (!userInfo)
        return Responder.respondWithFalseSuccess(req, res, {}, 'User not found. Please Sign Up!')
      if (!userInfo.password)
        return Responder.respondWithFalseSuccess(req, res, {}, 'Password is not set')
  
      if (bcrypt.compareSync(req.body.password, userInfo.password)) {
        const token = jwt.sign(
          {
            id: userInfo._id,
            userType: userInfo.usertype,
            fullName: userInfo.fullname,
          },
          config.jwtSecretKey,
          { expiresIn: config.jwtExpireToken }
        );
        userInfo.token = token;

        await userInfo.save();

        let responseObject = {
            userType: userInfo.usertype,
            userName: userInfo.fullname,
        }
        return Responder.respondWithSuccess(req, res,  { token, responseObject }, "Login Successfully")
  
    } else {
        //return Responder.respondWithCustomError(req, res, 'Invalid email or password!!!')
        return Responder.respondWithFalseSuccess(req, res, null, 'Invalid email or password!')
      }
    } catch (error) {
      return Responder.respondWithError(req, res, error);
    }
  };