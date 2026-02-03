// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { compare, hash, genSalt } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const now = new Date().toISOString();
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
                        return { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role };
                    }

                    // Regular User Path
                    const user = await User.findOne({ email }).select('+password');
                    if (!user || !(await compare(credentials.password, user.password))) return null;

                    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
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
                token.role = (user as any).role;
                token.id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_now",
};