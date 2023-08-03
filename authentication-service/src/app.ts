import express from "express";
import config from "config";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";

import auth from "./middlewares/auth-with-github";
import githubRouter from "./routes/github";
import mongoConnection from "./middlewares/mongo";
import { get400, get404, get500 } from "./middlewares/error";
import authRouter from "./routes/auth";

const app = express();
const port = config.get("app.port");

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
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

app.use("/auth", authRouter);
app.use("/github", githubRouter);

app.use(get404);
app.use(get400);
app.use(get500);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
