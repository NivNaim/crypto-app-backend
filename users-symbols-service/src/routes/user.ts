import express, { Router } from "express";
import {
  addSymbol,
  getSymbolsWithValues,
} from "../controllers/user-controller/controller";
import inputValidator from "../middlewares/input-validator";
import { symbolSchema } from "../controllers/user-controller/input-validator";
import { verifyToken } from "../middlewares/verifyToken";

const userRouter: Router = express.Router();

userRouter.get("/get-symbols-with-values", verifyToken, getSymbolsWithValues);

userRouter.post(
  "/add-symbol",
  verifyToken,
  inputValidator(symbolSchema),
  addSymbol
);

export default userRouter;
