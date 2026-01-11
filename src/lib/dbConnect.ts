import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/** * Use Global to preserve connection during Next.js Hot Module Replacement (HMR)
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of hanging Turbopack
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Reset promise on failure to allow retry
        throw e;
    }
    return cached.conn;
}

export default dbConnect;