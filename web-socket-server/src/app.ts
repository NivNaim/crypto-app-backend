import express from "express";
import config from "config";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import mongoConnection from "./middlewares/mongo";
import { get400, get404, get500 } from "./middlewares/error";
import Symbol from "./models/symbol";
import SymbolValue from "./models/symbol-value";

const app = express();
const port = config.get("app.port");
export const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.urlencoded({ extended: false }));

app.use(mongoConnection);

app.use(get404);
app.use(get400);
app.use(get500);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const BATCH_SIZE: number = config.get("batchSize");
const BATCH_INSERT_INTERVAL: number = config.get("batchInsertInterval");

const symbolValuesToInsert = [];

const insertSymbolValuesBatch = async () => {
  try {
    if (symbolValuesToInsert.length === 0) {
      return;
    }

    const batch = symbolValuesToInsert.splice(0, BATCH_SIZE);

    await SymbolValue.insertMany(batch);

    console.log(`Batch of ${batch.length} SymbolValue documents inserted.`);
  } catch (err) {
    console.log("Error performing batch insert:", err);
  }
};

setInterval(insertSymbolValuesBatch, BATCH_INSERT_INTERVAL);

io.on("connection", async (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on(
    "message from client",
    async (data: { symbol: string; value: number; dateTime: string }) => {
      const { symbol, value, dateTime } = data;

      console.log(
        `Received data from client ${symbol}:${value} at ${dateTime}`
      );

      try {
        const symbolDocument = await Symbol.findOne({
          symbol: symbol,
        }).maxTimeMS(30000);
        console.log(symbolDocument);
        if (!symbolDocument) {
          throw new Error(`Symbol not found for ${symbol}`);
        }

        const symbolValueData = {
          symbol: symbolDocument._id,
          value: value,
          dateTime: dateTime,
        };

        symbolValuesToInsert.push(symbolValueData);

        socket.emit("data saved", { symbol, value, dateTime });
      } catch (err) {
        console.log(err);
      }
    }
  );
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
