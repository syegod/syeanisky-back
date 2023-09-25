import mongoose from "mongoose";
import { config } from "dotenv";
config();

export default async function main(){
    try {
        const connection = process.env.DB_CONNECTION;
        await mongoose.connect(connection);
        console.log('DB connected...')
    } catch (err) {
        console.log(err.message);
    }
}