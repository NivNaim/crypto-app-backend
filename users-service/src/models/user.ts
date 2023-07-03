import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  github_id: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
