import mongoose, { mongo } from "mongoose";

const MONGO_URI = process.env.MONGO_URI!
if (!MONGO_URI) {
    throw new Error("Check your database connection string")
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { con: null, promise: null };
}

export async function connectDB() {
    if (cached.con) {
        return cached.con
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }

        cached.promise = mongoose
            .connect(MONGO_URI, opts)
            .then(() => mongoose.connection)
    }

    try {
        cached.con = await cached.promise
    } catch (error) {
        cached.promise = null
    }
}