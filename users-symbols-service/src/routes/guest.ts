import express, { Router } from "express";
import { getSymbols } from "../controllers/guest";

const guestRouter: Router = express.Router();

guestRouter.get("/get-symbols", getSymbols);

export default guestRouter;
