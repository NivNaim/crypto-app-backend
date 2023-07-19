import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-request";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";

const generateAuthToken = (userId: string): string => {
  const tokenSecret = config.get("token.secret") as Secret;

  const token = jwt.sign({ userId: userId }, tokenSecret, {
    expiresIn: config.get("token.expiresIn"),
  });
  return token;
};

export const signin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || !req.user.id) {
    throw new Error("User not authenticated");
  }

  const authenticatedUserId = req.user.id;
  const token = generateAuthToken(authenticatedUserId);
  console.log(token);

  try {
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
    });

    res.redirect("http://localhost:3001/dashboard");
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.send("logout");
};
