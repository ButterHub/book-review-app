module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash(
        "error_msg",
        "You must be logged in and have permission for that action."
      );
      res.redirect("/users/login");
      // Now need to figure out protected routes
    }
  }
};
