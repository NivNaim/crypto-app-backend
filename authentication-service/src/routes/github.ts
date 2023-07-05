import express from "express";
import { Router } from "express";
import auth from "../middlewares/auth";

const githubRouter: Router = express.Router();

githubRouter.get("/", auth.authenticate("github", { scope: ["user:email"] }));
githubRouter.get(
  "/callback",
  auth.authenticate("github", {
    failureRedirect: "/welcome",
    successRedirect: "/dashboard",
  })
);

export default githubRouter;
