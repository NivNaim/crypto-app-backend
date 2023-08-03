import { ISymbol } from "./../types/symbol.d";
import mongoose, { Schema } from "mongoose";

const SymbolSchema: Schema = new Schema<ISymbol>({
  symbol: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 7,
    unique: true,
  },
});

const Symbol = mongoose.model<ISymbol>("Symbol", SymbolSchema);

export default Symbol;
