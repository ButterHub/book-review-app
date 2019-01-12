const mongoose = require("mongoose");

// Create Schema
const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  bookCoverUrl: {
    type: String
  },
  notes: {
    type: String,
    required: true
  }
});

mongoose.model("ideas", IdeaSchema);
