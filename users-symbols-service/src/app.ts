import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user";
import { get400, get404, get500 } from "./middlewares/error";
import mongoConnection from "./middlewares/mongo";
import guestRouter from "./routes/guest";

const app = express();
const port = process.env.APP_PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));

app.use(cookieParser());
app.use(express.json());

app.use(mongoConnection);

app.use(guestRouter);
app.use("/user", userRouter);

app.use(get404);
app.use(get400);
app.use(get500);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
