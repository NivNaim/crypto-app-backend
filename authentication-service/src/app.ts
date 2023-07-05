import express, { Response, NextFunction } from "express";
import config from "config";
import session from "express-session";
import auth from "./middlewares/auth";
import usersRouter from "./routes/users";
import githubRouter from "./routes/github";
import guestRouter from "./routes/guest";
import mongoConnection from "./middlewares/mongo";

const app = express();
const port = config.get("app.port");

app.use(
  session({
    secret: config.get("github.secret"),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(mongoConnection);

app.use(auth.initialize());
app.use(auth.session());

app.use("/", usersRouter);
app.use("/", guestRouter);
app.use("/github", githubRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
