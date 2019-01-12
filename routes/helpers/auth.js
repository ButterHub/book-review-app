module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash(
        "error_msg",
        "You were not authorised to view that private page."
      );
      res.redirect("/users/login");
      // Now need to figure out protected routes
    }
  }
};
