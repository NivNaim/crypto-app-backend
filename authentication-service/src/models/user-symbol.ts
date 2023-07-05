import mongoose, { Schema } from "mongoose";
import { IUserSymbol } from "../types/user-symbol";

const UserSymbolSchema: Schema = new Schema<IUserSymbol>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 5,
  },
});

const UserSymbol = mongoose.model<IUserSymbol>("UserSymbol", UserSymbolSchema);

export default UserSymbol;
