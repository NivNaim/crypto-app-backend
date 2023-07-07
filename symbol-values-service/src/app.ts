import express from "express";
import config from "config";

const app = express();
const port = config.get("app.port");

app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
