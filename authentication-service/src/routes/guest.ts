import express, { Router } from "express";
import { welcome } from "../controllers/guest";

const guestRouter: Router = express.Router();

guestRouter.get("/welcome", welcome);

export default guestRouter;
