const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// Load routes
const ideas = require("./routes/ideas"); // we exported the ideas and users router
const users = require("./routes/users");

// Load common variables
const vars = require("./vars");

// Mongoose connect
mongoose
  .connect(
    "mongodb://localhost/bbr-dev",
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

// Load idea model
require("./models/Idea");
// In Idea.js, we create a new Schema (new Schema({}))
// Then in Idea.js, we define this new schema to be called ideas. mongoose.model("ideas", SchemaOne)
const Idea = mongoose.model("ideas");

// Handlebars middleware (TOP LEVEL)
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware: Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware: static folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware: method override
app.use(methodOverride("_method"));

// Middleware: express-session - simple session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Middleware: connect-flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// parse application/json
app.use(bodyParser.json());

// creating a middleware
app.use(function(req, res, next) {
  // console.log(Date.now()); // will work on EVERY Request
  req.author = "Adrian B"; // defining a variable accessible throughout application
  next(); // calling next middleware
}); // Using a middleware. (defining the middleware too)

// Index route
app.get("/", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("index", {
        ideas,
        commonVariables: vars
      });
    });
  // middleware will take control of req/ res
}); // Can also use app.put, app.delete, .post

// ROUTE: About
app.get("/about", (req, res) => {
  res.render("about", { commonVariables: vars });
});

// ROUTE: ideas routes
app.use("/ideas", ideas);

// ROUTE: user routes
app.use("/users", users);

// Need to restart the server, when code is changed. (node index) using nodemon
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started.`);
});
