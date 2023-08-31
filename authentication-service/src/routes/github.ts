import express, { Router } from "express";
import auth from "../middlewares/auth-with-github";

const githubRouter: Router = express.Router();

githubRouter.get("/", auth.authenticate("github", { scope: ["user:email"] }));
githubRouter.get(
  "/callback",
  auth.authenticate("github", {
    successRedirect: process.env.GITHUB_SUCCESS_REDIRECT,
    failureRedirect: "/",
  })
);

export default githubRouter;
