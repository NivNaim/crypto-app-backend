import { Document } from "mongoose";
import { ISymbol } from "./symbol";

export interface ISymbolValue extends Document {
  symbol: ISymbol["_id"];
  value: number;
  dateTime: string;
}
