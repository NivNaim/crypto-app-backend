import express, { Router } from "express";
import {
  addSymbol,
  dashboard,
} from "../controllers/user-controller/controller";
import inputValidator from "../middlewares/input-validator";
import { symbolSchema } from "../controllers/user-controller/input-validator";
import { verifyToken } from "../middlewares/verifyToken";

const usersRouter: Router = express.Router();

usersRouter.get("/dashboard", verifyToken, dashboard);

usersRouter.post(
  "/add-symbol",
  verifyToken,
  inputValidator(symbolSchema),
  addSymbol
);

export default usersRouter;
