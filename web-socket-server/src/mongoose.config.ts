import { MongoClientOptions } from "mongodb";

export interface ConnectOptions extends MongoClientOptions {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
  useCreateIndex?: boolean;
}

const mongooseConfig: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  minPoolSize: 5,
  maxPoolSize: 10,
};

export default mongooseConfig;
