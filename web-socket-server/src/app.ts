import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import axios from "axios";
import mongoose from "mongoose";
import config from "config";
import Symbol from "./models/symbol";
import { get400, get404, get500 } from "./middlewares/error";
import { ISymbol } from "./types/symbol";
import SymbolValue from "./models/symbol-value";
import dbConnection from "./db/connection";

const app = express();
const port = config.get("socket-server.port");
const loopTimeout: number = config.get("socket-server.timeout");
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["my-custom-header"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(get404);
app.use(get400);
app.use(get500);

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

const fetchAndSaveCryptoRates = async (symbol: string): Promise<any> => {
  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/price`,
      {
        params: {
          fsym: symbol,
          tsyms: "USD",
          api_key: config.get("cryptocompare.api-key"),
        },
      }
    );

    const symbolDocument = await Symbol.findOne({ symbol });
    if (!symbolDocument) {
      throw new Error(`Symbol not found for ${symbol}`);
    }

    const currentDateTime = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    const symbolValue = {
      symbol: symbolDocument._id,
      value: response.data.USD,
      dateTime: currentDateTime,
    };

    await SymbolValue.create(symbolValue);

    io.emit("data", symbolValue);

    return symbolValue;
  } catch (error) {
    console.log(`Error fetching exchange rates for ${symbol}:`, error);
    throw error;
  }
};

const loop = async (): Promise<void> => {
  try {
    const symbolsDocuments: ISymbol[] = await Symbol.find();
    const symbols: string[] = symbolsDocuments.map(
      (symbolDocument) => symbolDocument.symbol
    );
    console.log(`loop: found this symbol array: ${symbols}`);

    const promises = symbols.map((symbol: string) =>
      fetchAndSaveCryptoRates(symbol)
    );
    await Promise.allSettled(promises);

    setTimeout(loop, loopTimeout);
  } catch (err) {
    console.log("Error in loop:", err);
  }
};

dbConnection().then(() => {
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
    loop();
  });
});
