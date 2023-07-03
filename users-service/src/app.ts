import express from "express";
import config from "config";

const app = express();
const port = config.get("app.port");

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
