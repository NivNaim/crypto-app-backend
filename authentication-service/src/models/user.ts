import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user";

const UserSchema: Schema = new Schema<IUser>({
  github_id: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
