import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend global type for mongoose cache
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

async function dbConnect() {
    if (!MONGODB_URI) {
        console.error('[DB CONNECT] CRITICAL: MONGODB_URI is not defined.');
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    // 1. Return existing connection if healthy (readyState 1 = connected)
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // 2. Start a new connection promise if none exists
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Increased timeout slightly for serverless stability during AI heavy-lifting
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000, // Longer for large AI data transfers
            serverSelectionTimeoutMS: 10000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
            console.log('[DB CONNECT] New MongoDB connection established');
            return m;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Reset promise so next attempt can retry
        console.error('[DB CONNECT] Failed to connect to MongoDB:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;