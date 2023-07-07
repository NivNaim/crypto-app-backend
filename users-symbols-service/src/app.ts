import express from "express";
import config from "config";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users";
import { get400, get404, get500 } from "./middlewares/error";
import mongoConnection from "./middlewares/mongo";

const app = express();
const port = config.get("app.port");

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(mongoConnection);

app.use(usersRouter);

app.use(get404);
app.use(get400);
app.use(get500);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
