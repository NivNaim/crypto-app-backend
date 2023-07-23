import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { logout, login, signUp } from "../controllers/auth-controller/auth";
import inputValidator from "../middlewares/input-validator";
import { userSchema } from "../controllers/auth-controller/input-validator";

const authRouter: Router = express.Router();

authRouter.post("/sign-up", inputValidator(userSchema), signUp);

authRouter.post("/login", inputValidator(userSchema), login);

authRouter.get("/logout", logout);

export default authRouter;
