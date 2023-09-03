import { ConnectOptions } from "mongoose";

export interface CustomConnectOptions extends ConnectOptions {
  useUnifiedTopology: boolean;
}
