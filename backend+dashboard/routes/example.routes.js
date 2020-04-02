import { Router } from "express";
import exampleHandlers from "../handlers/example";
import middleware from "../handlers/middleware";

export const exampleRoutes = Router();

exampleRoutes.get("/", exampleHandlers.exampleAction);
exampleRoutes.get(
  "/profile",
  middleware.isLoggedIn,
  exampleHandlers.showProfile
);
exampleRoutes.get(
  "/dashboard",
  middleware.isLoggedIn,
  exampleHandlers.showDashboard
);

exampleRoutes.get(
  "/dashboard",
  middleware.isLoggedIn,
  exampleHandlers.showDashboard
);

export { exampleRoutes as default };
