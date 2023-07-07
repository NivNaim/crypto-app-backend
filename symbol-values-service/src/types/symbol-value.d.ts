import { Document } from "mongoose";

export interface ISymbolValue extends Document {
  symbol: string;
  value: number;
  createdAt: Date;
}
