import { Document, Types } from "mongoose";
import { ISymbol } from "./symbol";

export interface ISymbolValue extends Document {
  symbol: Types.ObjectId;
  value: number;
  dateTime: string;
}