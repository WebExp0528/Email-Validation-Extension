const middleware = {};

// route middleware to make sure a user is logged in
middleware.isLoggedIn = (req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
};

// route middleware to make sure a user is not logged in
middleware.isNotLoggedIn = (req, res, next) => {
  // if user is not authenticated in the session, carry on
  if (req.isUnauthenticated()) return next();

  // if they are authenticated in the session redirect them back
  res.redirect("back");
};

// route middleware to make sure a user is not logged in API
middleware.isLoggedInAPI = (req, res, next) => {
  // if user is not authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they are authenticated in the session redirect them back
  return res.status(401).send({
    message: "Please signin to use our API!"
  });
};

export { middleware as default };
