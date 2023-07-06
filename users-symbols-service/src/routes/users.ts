import express, { Router } from "express";
import { dashboard } from "../controllers/users";

const usersRouter: Router = express.Router();

usersRouter.get("/dashboard", dashboard);

export default usersRouter;
