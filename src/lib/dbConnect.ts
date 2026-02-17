import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

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
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    // Return existing connection if healthy
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
            // Senior Dev Additions:
            maxPoolSize: 10, // Recommended for serverless to prevent connection exhaustion
            autoIndex: process.env.NODE_ENV !== 'production', // Disable auto-indexing in prod for performance
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
            console.log(`[DB CONNECT] Connected to MongoDB (${process.env.NODE_ENV})`);
            return m;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('[DB CONNECT] Error:', e);
        throw e;
    }

    return cached.conn;
}

// Optional: Graceful shutdown for non-serverless environments (Docker/PM2)
if (process.env.NODE_ENV !== 'production') {
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
    });
}

export default dbConnect;
