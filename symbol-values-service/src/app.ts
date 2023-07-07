import express from "express";
import config from "config";
import mongoConnection from "./middlewares/mongo";
import { get400, get404, get500 } from "./middlewares/error";

const app = express();
const port = config.get("app.port");

app.use(express.urlencoded({ extended: false }));

app.use(mongoConnection);

app.use(get404);
app.use(get400);
app.use(get500);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
