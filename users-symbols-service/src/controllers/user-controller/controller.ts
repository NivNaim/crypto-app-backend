import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";
import UserSymbol from "../../models/user-symbol";
import Symbol from "../../models/symbol";
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

export const getSymbolsWithValues = async (
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
    const symbolDocument = await Symbol.findOne({ symbol });
    if (!symbolDocument) {
      throw new Error(`Symbol not found for ${symbol}`);
    }

    const userId = getUserIdFromToken(token.toString());
    const userSymbol = await UserSymbol.findOne({
      user_id: userId,
      symbol: symbolDocument._id,
    });
    if (userSymbol) {
      throw new Error(`The symbol ${symbol} has been tracked by this user`);
    }

    await UserSymbol.create({
      user_id: userId,
      symbol: symbolDocument._id,
    });
    res.send("symbol added");
  } catch (err) {
    next(err);
  }
};
