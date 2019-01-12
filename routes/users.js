const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load model
require("../models/User.js");
const User = mongoose.model("users");

// Load common variables
const vars = require("../vars");

// ROUTE: user login
router.get("/login", (req, res) => {
  res.render("users/login", {
    commonVariables: vars
  });
});

// ROUTE: user logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out.");
  res.redirect("/users/login");
});

// ROUTE post: user login
// TODO When login fails, pass the username and passsword previously entered, so user doesn't have to retype
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// ROUTE get: register form
router.get("/register", (req, res) => {
  res.render("users/register", {
    commonVariables: vars
  });
});

// ROUTE post: register form
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords don't match." });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered.");
        res.redirect("login");
      } else {
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        };
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            new User(user)
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered, try logging in."
                );
                res.redirect("login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

module.exports = router;
