const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((result) => {
            res.status(201).json({
              message: "Successfully user created",
              user: {
                _id: result._id,
                email: result.email,
                password: result.password,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  }

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((result) => {
        if (result.length < 1) {
          return res.status(401).json({
            message: "Auth Failed (Wrong Email)",
          });
        }
  
        bcrypt.compare(req.body.password, result[0].password, (err, resp) => {
          if (err) {
            return res.status(401).json({
              message: "Auth Failed",
            });
          }
  
          if (resp) {
            const token = jwt.sign(
              {
                email: result[0].email,
                userId: result[0]._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({
              message: "Auth Successed",
              token: token,
            });
          }
  
          res.status(401).json({
            message: "Auth Failed (Wrong Password)",
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }

exports.user_delete = (req, res, next) => {
    User.findByIdAndDelete({ _id: req.params.userId })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "User Had Been Deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}