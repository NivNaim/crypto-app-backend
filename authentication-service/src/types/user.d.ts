import { Document } from "mongoose";

export interface IUser extends Document {
  github_id: string;
}
