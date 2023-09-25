import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    passwordHash: {
        type: String,
        require: true
    },
    avatarUrl: String,
    lists: {
        viewed: { type: [Object], default: [] },
        planned: { type: [Object], default: [] },
        favorite: { type: [Object], default: [] },
        abandoned: { type: [Object], default: [] },
        watching: { type: [Object], default: [] },
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', UserSchema);
