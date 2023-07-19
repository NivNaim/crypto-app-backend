import express, { Router } from "express";
import { signin, logout } from "../controllers/users";

const usersRouter: Router = express.Router();

usersRouter.get("/dashboard", signin);

usersRouter.get("/logout", logout);

export default usersRouter;
