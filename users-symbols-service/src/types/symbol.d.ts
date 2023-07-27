import { Document, Schema } from "mongoose";

export interface ISymbol extends Document {
  symbol: string;
}
