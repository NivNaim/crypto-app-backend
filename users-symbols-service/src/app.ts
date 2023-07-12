import express from "express";
import config from "config";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import usersRouter from "./routes/users";
import { get400, get404, get500 } from "./middlewares/error";
import mongoConnection from "./middlewares/mongo";

const app = express();
const port = config.get("app.port");
export const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(mongoConnection);

app.use(usersRouter);

app.use(get404);
app.use(get400);
app.use(get500);

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
