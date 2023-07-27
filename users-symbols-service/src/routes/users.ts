import express, { Router } from "express";
import {
  addSymbol,
  getSymbolsWithValues,
} from "../controllers/user-controller/controller";
import inputValidator from "../middlewares/input-validator";
import { symbolSchema } from "../controllers/user-controller/input-validator";
import { verifyToken } from "../middlewares/verifyToken";

const usersRouter: Router = express.Router();

usersRouter.get("/get-symbols-with-values", verifyToken, getSymbolsWithValues);

usersRouter.post(
  "/add-symbol",
  verifyToken,
  inputValidator(symbolSchema),
  addSymbol
);

export default usersRouter;
