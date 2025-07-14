import { handleError } from "@/helper/handleError";
import mongoose from "mongoose";

export const connectDB = async () => {

    const dbUri = process.env.MONGODB_URL;

    try {
        const db = await mongoose.connect(dbUri as string);
        console.log(`MongoDB connected: ${db.connection.host}`);
    } catch (error) {
        handleError(error);
    }
}