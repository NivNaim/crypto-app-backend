import config from "config";
import axios from "axios";
import io, { Socket } from "socket.io-client";

import mongoConnection from "./middlewares/mongo";
import SymbolValue from "./models/symbol-value";
import Symbol from "./models/symbol";
import { ISymbol } from "./types/symbol";

const fetchCryproRates = async (
  symbol: string,
  socket: Socket
): Promise<any> => {
  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${config.get(
        "cryptocompare.base-currency"
      )}&api_key=${config.get("cryptocompare.api-key")}`
    );

    const symbolDocument = await Symbol.findOne({ symbol });
    if (!symbolDocument) {
      throw new Error(`Symbol not found for ${symbol}`);
    }

    const currentDateTime = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    const symbolValue = new SymbolValue({
      symbol: symbolDocument._id,
      value: response.data.USD,
      dateTime: currentDateTime,
    });
    await symbolValue.save();

    socket.emit("message from worker", {
      symbol: symbolValue.symbol,
      value: symbolValue.value,
      dateTime: symbolValue.dateTime,
    });
  } catch (error) {
    console.log("Error fetching exchange rates:", error);
    throw error;
  }
};

const loop = async (socket: Socket): Promise<void> => {
  const symbolsDocuments: ISymbol[] = await Symbol.find();
  const symbols: string[] = symbolsDocuments.map(
    (symbolDocument) => symbolDocument.symbol
  );
  console.log(`loop: found this symbol array: ${symbols}`);

  const promises = symbols.map((symbol: string) =>
    fetchCryproRates(symbol, socket)
  );
  await Promise.allSettled(promises);

  setTimeout(() => loop(socket), config.get("worker.interval"));
};

(async () => {
  await mongoConnection(null, null, async () => {
    const socket = io(
      `http://${config.get("worker.host")}:${config.get("worker.port")}`
    );

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    await loop(socket);
  });
})();
