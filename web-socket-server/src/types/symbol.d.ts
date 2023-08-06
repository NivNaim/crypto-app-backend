import { Document, Schema, Types } from "mongoose";

export interface ISymbol extends Document {
  _id: Types.ObjectId;
  symbol: string;
}
