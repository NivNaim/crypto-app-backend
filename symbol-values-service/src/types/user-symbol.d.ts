import { Document, Schema } from "mongoose";

export interface IUserSymbol extends Document {
  user_id: Schema.Types.ObjectId;
  symbol: string;
}
