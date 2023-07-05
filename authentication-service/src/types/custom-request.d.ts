import { Request } from "express";
import { IUser } from "./user";

export interface CustomRequest extends Request {
  user?: IUser;
}
