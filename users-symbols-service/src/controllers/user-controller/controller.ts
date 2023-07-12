import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";
import UserSymbol from "../../models/user-symbol";
import SymbolValue from "../../models/symbol-value";

export const getUserIdFromToken = (token: string): string => {
  const tokenSecret = config.get("token.secret") as Secret;

  try {
    const decodedToken = jwt.verify(token, tokenSecret);
    if (typeof decodedToken === "object" && "userId" in decodedToken) {
      return decodedToken.userId.toString();
    }
  } catch (err) {
    throw new Error("Invalid token");
  }
  throw new Error("Invalid token");
};

export const dashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const userId = getUserIdFromToken(token.toString());

    const userSymbols = await UserSymbol.find({ user_id: userId });

    const symbols = userSymbols.map((userSymbol) => userSymbol.symbol);

    const symbolValues = await SymbolValue.find({ symbol: { $in: symbols } })
      .sort({ timestamp: -1 })
      .limit(symbols.length)
      .exec();

    const latestValues = symbolValues.reduce((result, symbolValue) => {
      result[symbolValue.symbol] = symbolValue.value;
      return result;
    }, {});

    res.send({ symbols, latestValues });
  } catch (err) {
    next(err);
  }
};

export const addSymbol = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;
  const symbol = req.body.symbol;

  try {
    await UserSymbol.create({
      user_id: getUserIdFromToken(token.toString()),
      symbol: symbol,
    });
    res.send("symbol added");
  } catch (err) {
    next(err);
  }
};
