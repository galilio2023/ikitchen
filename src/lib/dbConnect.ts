import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    // 1. Return existing connection if healthy
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // 2. If a connection is already in progress, wait for it
    if (cached.promise) {
        cached.conn = await cached.promise;
        return cached.conn;
    }

    // 3. No connection or promise exists; start a new one
    const opts = {
        bufferCommands: false,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
    };


    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
        return m;
    });

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Reset so next request can retry
        throw e;
    }

    return cached.conn;
}

export default dbConnect;