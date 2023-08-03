import mongoose, { Schema } from "mongoose";
import { ISymbolValue } from "../types/symbol-value";

const SymbolValueSchema: Schema = new Schema<ISymbolValue>({
  symbol: {
    type: Schema.Types.ObjectId,
    ref: "Symbol",
  },
  value: { type: Number, required: true },
  dateTime: { type: String, required: true },
});

const SymbolValue = mongoose.model<ISymbolValue>(
  "SymbolValue",
  SymbolValueSchema
);

export default SymbolValue;
