import mongoose from "mongoose";
import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UsersModel from "../models/UsersModel";
import dotdev from "dotenv";
dotdev.config();

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  const find = { query: "" };
  try {
    const objectId = mongoose.Types.ObjectId(id);
    find.query = { _id: objectId };
  } catch (error) {
    find.query = { googleId: id };
  }
  UsersModel.findOne(find.query, function(err, user) {
    done(err, user);
  });
});

// =========================================================================
// LOCAL SIGN UP ===========================================================
// =========================================================================

passport.use(
  "local.signup",
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      // Validate values before passing them to database
      req
        .checkBody("email")
        .notEmpty()
        .isEmail()
        .withMessage("Email is invalid.");
      req
        .checkBody("password")
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage("Password is required and must have min 4 characters.");
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Name is is required");
      req
        .checkBody("confirmPassword")
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage(
          "Confirm password is required and must have min 4 characters."
        );

      // get errors if there is any
      const errors = req.validationErrors();
      if (req.body.password !== req.body.confirmPassword) {
        errors.push({ msg: "Password and Confirm Password do not match" });
      }
      // check errors
      if (errors) {
        // push errors in array
        let messages = [];
        errors.forEach(error => {
          messages.push(error.msg);
        });

        // add error messages to req.flash with error key
        return callback(null, false, req.flash("error", messages));
      }

      UsersModel.findOne({ email: email })
        .then(user => {
          // we already have user with the provided email
          if (user) {
            return callback(null, false, {
              message: "Please enter another email. This one is already in use."
            });
          }

          const name = req.body.name;

          const newUser = new UsersModel();

          newUser.email = email;
          newUser.password = newUser.encryptPassword(password);
          newUser.name = name;

          // save new user
          newUser
            .save()
            .then(user => {
              req.session.user = user;
              req.session.save();
              callback(null, newUser);
            })
            .catch(e => callback(e));
        })
        .catch(e => callback(e));
    }
  )
);

// =========================================================================
// LOCAL SIGN IN ===========================================================
// =========================================================================

passport.use(
  "local-sign-in",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to sign in already exists
      UsersModel.findOne({ email: email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err) return done(err);

        // if no user is found, return the message
        if (!user)
          return done(
            null,
            false,
            req.flash("error", ["Oops! Wrong credentials."])
          ); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.isValidPassword(password))
          return done(
            null,
            false,
            req.flash("error", ["Oops! Wrong credentials."])
          ); // create the messages and save it to session as flashdata

        // all is well, return successful user
        req.session.user = user;
        req.session.save();
        return done(null, user);
      });
    }
  )
);

// =========================================================================
// GOOGLE+ SIGN UP and SIGN IN =============================================
// =========================================================================
// Authorize, store user info in session, store user info in DB (if new user)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}auth/google/callback`,
      passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        /* store user info in DB (if new user) --*/
        return UsersModel.findOne({ googleId: profile.id }, (err, user) => {
          if (user) {
            /* store user info in session --*/
            user["accessToken"] = accessToken;
            request.session.user = user;
            request.session.save();
            done(null, profile);
            return;
          }
          const image =
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null;
          const newUser = new UsersModel({
            name: profile.displayName,
            email: profile.email,
            password: null,
            googleId: profile.id,
            image: profile.photos[0].value,
            role: 0
          });
          newUser.save().then(user => {
            /* store user info in session --*/
            user["accessToken"] = accessToken;
            request.session.user = user;
            request.session.save();
            done(null, profile);
          });
        });
      });
    }
  )
);
