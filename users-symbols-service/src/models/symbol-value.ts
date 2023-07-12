import mongoose, { Schema } from "mongoose";
import { ISymbolValue } from "../types/symbol-value";

const SymbolValueSchema: Schema = new Schema<ISymbolValue>({
  symbol: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 5,
  },
  value: { type: Number, required: true },
});

const SymbolValue = mongoose.model<ISymbolValue>(
  "SymbolValue",
  SymbolValueSchema
);

export default SymbolValue;
