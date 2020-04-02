import { Router } from "express";
import apiExampleHandlers from "../handlers/apiExample";
import middleware from "./../handlers/middleware";

const apiExampleRoutes = Router();

apiExampleRoutes.post("/", apiExampleHandlers.exampleCreate);

apiExampleRoutes.post(
  "/register-domain",
  middleware.isLoggedInAPI,
  apiExampleHandlers.registerDomain
);

apiExampleRoutes.post(
  "/register-email",
  middleware.isLoggedInAPI,
  apiExampleHandlers.registerEmail
);

apiExampleRoutes.post(
  "/update-domain-list",
  middleware.isLoggedInAPI,
  apiExampleHandlers.updateDomainList
);

apiExampleRoutes.post(
  "/update-email-list",
  middleware.isLoggedInAPI,
  apiExampleHandlers.updateEmailList
);

export { apiExampleRoutes as default };
