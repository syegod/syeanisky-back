import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
    },
    passwordHash: {
      type: String,
      require: true,
    },
    avatarUrl: String,
    list: [
      {
        anime: { type: Object },
        rating: { type: Number, default: 0 },
        episodes: { type: Number, default: 0 },
        date: { type: Date },
        list: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
