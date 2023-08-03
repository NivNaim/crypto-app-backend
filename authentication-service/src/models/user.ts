import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user";

const UserSchema: Schema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  github_id: {
    type: String,
  },
});

UserSchema.pre<IUser>("save", function (next) {
  const hasGitHubAuth = !!this.github_id;
  const hasEmailAndPassword = !!this.email && !!this.password;

  if (!(hasGitHubAuth || hasEmailAndPassword)) {
    next(new Error("At least one authentication method is required"));
  } else {
    next();
  }
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
