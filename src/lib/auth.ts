// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { compare, hash, genSalt } from "bcryptjs";

// Extend the default user type
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    await dbConnect();
                    const email = credentials.email.toLowerCase().trim();

                    // Admin Special Case
                    const isAdmin = email === 'ibrahimgalal2011@gmail.com' && credentials.password === '@Ibrahim@galal@1';

                    if (isAdmin) {
                        let admin = await User.findOne({ email }).select('+password');
                        if (!admin) {
                            admin = await User.create({
                                name: "Ibrahim Admin",
                                email,
                                password: credentials.password,
                                role: 'admin'
                            });
                        } else {
                            const isMatch = await compare(credentials.password, admin.password);
                            if (!isMatch) {
                                const salt = await genSalt(10);
                                const hashed = await hash(credentials.password, salt);
                                await User.updateOne({ _id: admin._id }, { $set: { password: hashed } });
                            }
                        }
                        return { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role } as ExtendedUser;
                    }

                    // Regular User Path
                    const user = await User.findOne({ email }).select('+password');
                    if (!user || !(await compare(credentials.password, user.password))) return null;

                    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role } as ExtendedUser;
                } catch (error) {
                    console.error(`[AUTH][${new Date().toISOString()}] CRITICAL ERROR:`, error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as ExtendedUser).role;
                token.id = (user as ExtendedUser).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_now",
    debug: process.env.NODE_ENV === 'development',
};