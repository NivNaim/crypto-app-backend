import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-request";
import UserSymbol from "../models/user-symbol";
import SymbolValue from "../models/symbol-value";
import axios from "axios";
import jwt from "jsonwebtoken";
import config from "config";

const generateAuthToken = (userId: string): string => {
  const token = jwt.sign({ userId: userId }, config.get("token.secret"), {
    expiresIn: config.get("expiresIn"),
  });
  return token;
};

export const sendToDashboard = async (
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
    res.redirect(`http://localhost:3001/dashboard?token=${token}`);
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
