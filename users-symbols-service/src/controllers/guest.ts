import { Request, Response, NextFunction } from "express";
import Symbol from "../models/symbol";

export const getSymbols = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const symbols = await Symbol.find({}, "symbol");
    const symbolNames = symbols.map((symbol) => symbol.symbol);
    res.json(symbolNames);
  } catch (error) {
    console.log("Error fetching symbols:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
