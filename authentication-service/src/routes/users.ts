import express, { Router } from "express";
import { sendToDashboard, logout } from "../controllers/users";

const usersRouter: Router = express.Router();

usersRouter.get("/dashboard", sendToDashboard);

usersRouter.get("/logout", logout);

export default usersRouter;
