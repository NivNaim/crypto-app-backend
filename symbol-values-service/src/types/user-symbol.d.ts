import { Document, Schema } from "mongoose";
import { ISymbol } from "./symbol";

export interface IUserSymbol extends Document {
  user_id: Schema.Types.ObjectId;
  symbol: ISymbol["_id"];
}
