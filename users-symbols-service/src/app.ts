import express from "express";
import config from "config";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import userRouter from "./routes/user";
import { get400, get404, get500 } from "./middlewares/error";
import mongoConnection from "./middlewares/mongo";
import guestRouter from "./routes/guest";

const app = express();
const port = config.get("app.port");
export const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cookieParser());
app.use(express.json());

app.use(mongoConnection);

app.use(guestRouter);
app.use("/user", userRouter);

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

io.on("connection", async (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("message from worker", (data) => {
    console.log(`Recieved data from worker ${data.symbol}:${data.value}`);
    io.emit("update from express", data);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
