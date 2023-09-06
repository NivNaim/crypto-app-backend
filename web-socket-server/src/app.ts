import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import axios from "axios";
import config from "config";
import Symbol from "./models/symbol";
import { get400, get404, get500 } from "./middlewares/error";
import { ISymbol } from "./types/symbol";
import SymbolValue from "./models/symbol-value";
import dbConnection from "./db/connection";
import { ISymbolValue } from "./types/symbol-value";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

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

const fetchRealTimeValue = async (symbol) => {
  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/price`,
      {
        params: {
          fsym: symbol,
          tsyms: `${config.get("cryptocompare.base-currency")}`,
          api_key: config.get("cryptocompare.api-key"),
        },
      }
    );
    const currentDateTime = new Date().toISOString();
    return {
      symbol: symbol,
      value: response.data.USD,
      dateTime: currentDateTime,
    };
  } catch (error) {
    console.log(`Error fetching real-time value for ${symbol}:`, error);
    throw error;
  }
};

const fetchHistoricalValues = async (symbol) => {
  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histoday`,
      {
        params: {
          fsym: symbol,
          tsym: `${config.get("cryptocompare.base-currency")}`,
          limit: 7,
          api_key: config.get("cryptocompare.api-key"),
        },
      }
    );
    const historicalData = response.data.Data.Data;
    return historicalData.map((entry: { time: number; close: any }) => ({
      date: new Date(entry.time * 1000).toISOString().split("T")[0],
      value: entry.close,
    }));
  } catch (error) {
    console.log(`Error fetching historical values for ${symbol}:`, error);
    throw error;
  }
};

const emitRealTimeValues = async (socket: Socket) => {
  const symbolsDocuments = await Symbol.find();
  const realTimeValues = await Promise.all(
    symbolsDocuments.map((symbolDocument) =>
      fetchRealTimeValue(symbolDocument.symbol)
    )
  );
  socket.emit("realTimeValues", realTimeValues);
};

const emitLastWeekValues = async (socket) => {
  const symbolsDocuments = await Symbol.find();
  const lastWeekValues = await Promise.all(
    symbolsDocuments.map((symbolDocument) =>
      fetchHistoricalValues(symbolDocument.symbol)
    )
  );
  const symbolData = {};
  symbolsDocuments.forEach((symbolDocument, index) => {
    const symbol = symbolDocument.symbol;
    symbolData[symbol] = lastWeekValues[index];
  });
  socket.emit("lastWeekValues", symbolData);
};

io.on("connection", async (socket) => {
  console.log("Socket client connected:", socket.id);

  await emitRealTimeValues(socket);

  await emitLastWeekValues(socket);

  setInterval(async () => {
    await emitLastWeekValues(socket);
  }, 24 * 60 * 60 * 1000);
});

dbConnection().then(() => {
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
