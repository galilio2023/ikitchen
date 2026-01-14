import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Compare password method - using a regular function to ensure 'this' context
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    console.log(`[USER MODEL] verifyPassword starting for: ${this.email}`);
    if (!password || !this.password) return false;
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        console.error(`[USER MODEL] verifyPassword error:`, err);
        return false;
    }
};

// Hash password before saving - using explicit callback 'next' for maximum compatibility
UserSchema.pre('save', function(next) {
    const user = this;
    
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    try {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password as string, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } catch (err: any) {
        next(err);
    }
});

console.log('[USER MODEL] Initializing User model...');

// Force model removal in development to ensure schema updates are applied
if (process.env.NODE_ENV === 'development' && mongoose.models.User) {
    delete mongoose.models.User;
}

const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

console.log('[USER MODEL] User model ready.');

export default User;
