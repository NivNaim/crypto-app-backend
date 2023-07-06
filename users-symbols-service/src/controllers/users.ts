import { NextFunction, Request, Response } from "express";

export const dashboard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token;
  console.log(token);
};
