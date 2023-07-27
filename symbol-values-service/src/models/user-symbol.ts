import mongoose, { Schema } from "mongoose";
import { IUserSymbol } from "../types/user-symbol";

const UserSymbolSchema: Schema = new Schema<IUserSymbol>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  symbol: {
    type: Schema.Types.ObjectId,
    ref: "Symbol",
    required: true,
  },
});

const UserSymbol = mongoose.model<IUserSymbol>("UserSymbol", UserSymbolSchema);

export default UserSymbol;
