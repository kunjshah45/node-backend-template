const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let userSchema = new Schema(
    {
      fullname: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        unique: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true,
      },
      password: { type: String },
      mobile: {
        type: String,
        validate: {
          validator: function (mobile) {
            return /^[0-9]*$/.test(mobile);
          },
          message: (props) => `${props.value} is not a valid mobile number!`,
        },
        // unique: true,
        // required: [true, 'User mobile number required']
      },
    //   usertype: { type: Number },
      ext: { type: String },
    //   country: { type: String },
    //   countryid: { type: Schema.Types.ObjectId, ref: "Countries" },
    //   stateid: { type: Schema.Types.ObjectId, ref: "States" },
    //   cityid: { type: Schema.Types.ObjectId, ref: "Cities" },
      dob: { type: Date },
      gender: { type: Number }, //- male-1, female-2
      photo: { type: String },
      verify: { type: Number, default: 0 }, //-1- verified  //-0- not verified
      token: { type: String },
      sms_token: { type: Number },
      otpExpires: { type: Date },
      otps: {
        emailOtp: { type: Number },
        smsOtp: { type: Number },
        expires: { type: Date }
      },
      isEmailVerified: { type: Boolean, default: false }, //- email true when, when email verified
      isMobileVerified: { type: Boolean, default: false },
      fcmToken: { type: String },
      notification: {
        type: Boolean,
        default: true,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    //   isPremimum: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   signupFrom: {
    //     type: String,
    //     enum: ["android", "ios", "web", "bulk", "dashboard"],
    //   },
      profilename: { type: String, unique: true, trim: true, lowercase: true }, // profilename/ username is a variable which is unique.
      status: { type: Number, default: 0 }, //-0- not verified //-1- verified
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: true,
      },
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );


userSchema.pre("save", function (next) {
    try {
      if (!this.isNew) return next();
      let referralString = "abcdefghijklmnopqrstuvwxyz0123456789";
      let referralCode = [...Array(7)]
        .map((_) => referralString[~~(Math.random() * referralString.length)])
        .join("");
      this.referralCode = referralCode;
      next();
    } catch (error) {
      return next(error);
    }
  });
  userSchema.pre("save", async function save(next) {
    try {
      if (!this.isModified("password")) return next();
      const rounds = 10;
      const hash = await bcrypt.hash(this.password, rounds);
      this.password = hash;
      return next();
    } catch (error) {
      return next(error);
    }
  });
  
  userSchema.method({
    generateToken(req) {
      let user = {
        name: this.fullname,
        id: this._id,
        userType: this.usertype,
        sessionId: req.sessionID,
      };
      return jwt.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_INTERVAL,
      });
    },
    async passwordMatches(password) {
      return bcrypt.compare(password, this.password);
    },
  });
  
  userSchema.statics = {
    
    async getByEmail(email, val) {
      try {
        let user = await this.findOne({
          email: email.toLowerCase().trim(),
        }).select(val);
        return user;
      } catch (error) {
        throw error;
      }
    },
    async getById(id, val) {
      try {
        let user = await this.findById(id).select(val);
        return user;
      } catch (error) {
        throw error;
      }
    },
    async matchOtp(user, otp) {
      try {
        let flag = false;
        if (user.otps.emailOtp == otp) {
          user.isEmailVerified = true;
          flag = true;
        }
        if (user.otps.smsOtp == otp) {
          user.isMobileVerified = true;
          flag = true;
        }
        user.flag = flag;
        return user;
      } catch (error) {
        throw error;
      }
    },
  };
  
module.exports = mongoose.model("Users", userSchema, 'users');