import express from "express";
import { Router } from "express";
import config from "config";

import auth from "../middlewares/auth-with-github";

const githubRouter: Router = express.Router();

githubRouter.get("/", auth.authenticate("github", { scope: ["user:email"] }));
githubRouter.get(
  "/callback",
  auth.authenticate("github", {
    successRedirect: `${config.get("github.clientUrl")}`,
    failureRedirect: "/",
  })
);

export default githubRouter;
