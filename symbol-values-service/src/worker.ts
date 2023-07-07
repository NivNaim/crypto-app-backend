import config from "config";
import axios from "axios";
import io, { Socket } from "socket.io-client";

import SymbolValue from "./models/symbol-value";
import mongoConnection from "./middlewares/mongo";

const fetchExchangeRates = async (baseCurrency: string): Promise<any> => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${config.get(
        "exchange-rates.api-key"
      )}/latest/${baseCurrency}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching exchange rates:", error);
    throw error;
  }
};

const loop = async (socket: Socket): Promise<void> => {
  const symbols = ["ILS", "EUR", "GBP"];
  console.log(`loop: found this symbol array: ${symbols}`);

  try {
    const baseCurrency: string = config.get("exchange-rates.base-currency");
    const exchangeRates = await fetchExchangeRates(baseCurrency);

    symbols.forEach((symbol) => {
      if (
        exchangeRates &&
        exchangeRates.conversion_rates &&
        exchangeRates.conversion_rates[symbol]
      ) {
        const value = exchangeRates.conversion_rates[symbol];
        socket.emit("message from worker", {
          symbol: symbol,
          value: value,
        });
        console.log(`Emitted ${value} for ${symbol}`);
      } else {
        console.log(`No exchange rate found for ${symbol}`);
      }
    });
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }

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
