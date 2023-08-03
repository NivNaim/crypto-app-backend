import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const get400 = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).send(error);
};

export const get404 = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Page not found!");
};

export const get500 = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ error: "Internal Server Error" });
};
