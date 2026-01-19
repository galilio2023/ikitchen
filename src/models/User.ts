import mongoose, { Document, Schema } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    image: String,
}, {
    timestamps: true,
});

// Database indexes for query optimization
UserSchema.index({ email: 1 }, { unique: true }); // Email is already unique but explicit index helps

// Compare password method - using a regular function to ensure 'this' context
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    console.log(`[USER MODEL] verifyPassword starting for: ${this.email}`);
    if (!password || !this.password) {
        console.log(`[USER MODEL] verifyPassword: Missing password or hash`);
        return false;
    }
    try {
        const isMatch = await compare(password, this.password);
        console.log(`[USER MODEL] verifyPassword result: ${isMatch}`);
        return isMatch;
    } catch (err) {
        console.error(`[USER MODEL] verifyPassword error:`, err);
        return false;
    }
};

// Hash password before saving
UserSchema.pre('save', async function() {
    const user = this;
    
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return;
    }

    try {
        console.log(`[USER MODEL] Hashing password for: ${user.email}`);
        const salt = await genSalt(10);
        user.password = await hash(user.password as string, salt);
        console.log(`[USER MODEL] Password hashed successfully`);
    } catch (err) {
        const error = err as Error;
        console.error('[USER MODEL] Error hashing password:', error);
        throw error;
    }
});

console.log('[USER MODEL] Initializing User model...');

// Standard Next.js model initialization to avoid re-registration errors
const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

console.log('[USER MODEL] User model ready.');

export default User;
