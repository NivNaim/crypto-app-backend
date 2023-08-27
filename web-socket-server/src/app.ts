import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import axios from "axios";
import Symbol from "./models/symbol";
import { get400, get404, get500 } from "./middlewares/error";
import dbConnection from "./db/connection";

const app = express();
const port = process.env.SOCKET_SERVER_PORT || 3002;
const loopTimeout: number = parseInt(process.env.SOCKET_SERVER_TIMEOUT || "10000", 10);
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
          tsyms: process.env.CRYPTO_BASE_CURRENCY || "USD",
          api_key: process.env.CRYPTO_API_KEY,
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
          tsym: process.env.CRYPTO_BASE_CURRENCY || "USD",
          limit: 7,
          api_key: process.env.CRYPTO_API_KEY,
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
