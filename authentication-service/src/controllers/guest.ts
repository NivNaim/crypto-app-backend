import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-request";

export const welcome = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.send("welcome");
};
