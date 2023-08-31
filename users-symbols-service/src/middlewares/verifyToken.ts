import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const tokenSecret = process.env.TOKEN_SECRET || "my secret key";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    jwt.verify(token, tokenSecret);
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
