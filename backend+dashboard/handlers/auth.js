const UsersModel = require("../models/UsersModel");

const authHandlers = {};

// Show local sign in and local sign up forms,google sign in button
authHandlers.showAuthPage = (req, res) => {
  const messages = req.flash("error");
  res.render("pages/auth/auth.pug", {
    title: "Sign In or sign up",
    messages
  });
};
// Sign out
authHandlers.signOut = (req, res) => {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};

export { authHandlers as default };
