import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";

const tokenSecret = config.get("token.secret") as Secret;

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
