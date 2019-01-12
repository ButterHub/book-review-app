const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Load common variables
const vars = require("../vars");

// ROUTE: Idea index
router.get("/", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("./ideas/index", {
        ideas,
        commonVariables: vars
      });
    });
});

// ROUTE: Add Idea
router.get("/add", (req, res) => {
  res.render("ideas/add", { commonVariables: vars });
});

// ROUTE: Edit post
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea,
      commonVariables: vars
    });
  });
});

// ROUTE: edit post form
// Need method override because cannot use method="put" in html
router.put("/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.author = req.body.author;
    idea.bookCoverUrl = req.body.bookCoverUrl;
    idea.notes = req.body.notes;
    idea.date = Date.now();
    idea.save().then(idea => {
      res.redirect("/ideas");
    });
  });
});

// ROUTE: Delete post
router.delete("/:id", (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Book removed");
    res.redirect("/ideas");
  });
});

router.post("/", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a book title." });
  }
  if (!req.body.author) {
    errors.push({ text: "Please enter an author." });
  }
  if (!req.body.bookCoverUrl) {
    errors.push({ text: "Please add the URL for the image." });
  }
  if (!req.body.notes) {
    errors.push({ text: "Please add some notes." });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title: req.body.title,
      author: req.body.author,
      bookCoverUrl: req.body.bookCoverUrl,
      notes: req.body.notes
    });
  } else {
    const newUser = {
      title: req.body.title,
      author: req.body.author,
      bookCoverUrl: req.body.bookCoverUrl,
      notes: req.body.notes
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Book added successfully.");
      res.redirect("/ideas");
    });
  }
});

module.exports = router;
