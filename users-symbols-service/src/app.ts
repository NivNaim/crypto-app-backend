import express from "express";
import config from "config";
import usersRouter from "./routes/users";

const app = express();
const port = config.get("app.port");

app.use(usersRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
