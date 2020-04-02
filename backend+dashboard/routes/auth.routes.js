import { Router } from "express";
import passport from "passport";
import authHandlers from "../handlers/auth";
import middleware from "../handlers/middleware";

const authRoutes = Router();

authRoutes.get("/", middleware.isNotLoggedIn, authHandlers.showAuthPage);
authRoutes.post(
  "/local-sign-up",
  passport.authenticate("local.signup", {
    successRedirect: "/dashboard", // redirect to profile page
    failureRedirect: "/auth", // redirect back to the auth page if there is an error
    failureFlash: true // allow flash messages
  })
);
authRoutes.post(
  "/local-sign-in",
  passport.authenticate("local-sign-in", {
    successRedirect: "/dashboard", // redirect to profile page
    failureRedirect: "/auth", // redirect back to the auth page if there is an error
    failureFlash: true // allow flash messages
  })
);
authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard", // redirect to profile page
    failureRedirect: "/auth/" // redirect back to the auth page if there is an error
  })
);

authRoutes.get("/sign-out", authHandlers.signOut);

export { authRoutes as default };
