import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-request";
import UserSymbol from "../models/user-symbol";
import SymbolValue from "../models/symbol-value";
import axios from "axios";

export const sendToDashboard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || !req.user.id) {
    throw new Error("User not authenticated");
  }

  const authenticatedUserId = req.user.id;

  // const userSymbols = await UserSymbol.find({ user_id: authenticatedUserId });

  // const symbols = userSymbols.map((userSymbol) => userSymbol.symbol);
  // const symbolValues = await SymbolValue.find({ symbol: { $in: symbols } });
  // res.send({
  //   userSymbols: userSymbols,
  //   symbolValues: symbolValues,
  // });
  try {
    await axios.post("http://localhost:3001/dashboard");

    res.send(authenticatedUserId);
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
