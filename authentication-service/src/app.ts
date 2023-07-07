import express from "express";
import config from "config";
import session from "express-session";
import auth from "./middlewares/auth";
import usersRouter from "./routes/users";
import githubRouter from "./routes/github";
import guestRouter from "./routes/guest";
import mongoConnection from "./middlewares/mongo";
import { get400, get404, get500 } from "./middlewares/error";

const app = express();
const port = config.get("app.port");

app.use(
  session({
    secret: config.get("github.secret"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  })
);

app.use(mongoConnection);

app.use(auth.initialize());
app.use(auth.session());

app.use("/", usersRouter);
app.use("/", guestRouter);
app.use("/github", githubRouter);

app.use(get404);
app.use(get400);
app.use(get500);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
