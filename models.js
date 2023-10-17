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
    lists: {
      viewed: {
        type: [
          {
            anime: Object,
            rated: {type: Number, default: null},
            episodes_watched: {type: Number, default: 0},
            date: Date,
          },
        ],
        default: [],
      },
      planned: {
        type: [
          {
            anime: Object,
            rated: {type: Number, default: null},
            episodes_watched: {type: Number, default: 0},
            date: Date,
          },
        ],
        default: [],
      },
      favorite: {
        type: [
          {
            anime: Object,
            rated: {type: Number, default: null},
            episodes_watched: {type: Number, default: 0},
            date: Date,
          },
        ],
        default: [],
      },
      abandoned: {
        type: [
          {
            anime: Object,
            rated: {type: Number, default: null},
            episodes_watched: {type: Number, default: 0},
            date: Date,
          },
        ],
        default: [],
      },
      watching: {
        type: [
          {
            anime: Object,
            rated: {type: Number, default: null},
            episodes_watched: {type: Number, default: 0},
            date: Date,
          },
        ],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
