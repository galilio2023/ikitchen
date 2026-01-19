import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { compare, hash, genSalt } from "bcryptjs";

const handler = NextAuth({
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
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                console.log(`[AUTH][${now}] Attempting login for: ${credentials.email}`);
                await dbConnect();

                // 🚀 SPECIAL CASE: Always ensure the requested admin exists
                const isAdminEmail = credentials.email.toLowerCase().trim() === 'ibrahimgalal2011@gmail.com';
                const isAdminPass = credentials.password === '@Ibrahim@galal@1';

                if (isAdminEmail && isAdminPass) {
                    console.log(`[AUTH][${now}] Admin credentials MATCHED`);
                    let admin = await User.findOne({ email: credentials.email.toLowerCase().trim() }).select('+password');
                    
                    if (!admin) {
                        console.log(`[AUTH][${now}] Admin user NOT FOUND in DB, creating new...`);
                        try {
                            console.log(`[AUTH][${now}] Creating admin user in DB...`);
                            admin = await User.create({
                                name: "Ibrahim Admin",
                                email: credentials.email.toLowerCase().trim(),
                                password: credentials.password,
                                role: 'admin'
                            });
                            console.log(`[AUTH][${now}] Admin user successfully CREATED with ID: ${admin?._id}`);
                        } catch (createErr) {
                            const error = createErr as Error;
                            console.error(`[AUTH][${now}] CRITICAL ERROR during User.create:`, error);
                            console.error(`[AUTH][${now}] Error Stack:`, error.stack);
                            throw new Error(`Admin creation failed: ${error.message}`);
                        }
                    } else {
                        console.log(`[AUTH][${now}] Admin user FOUND in DB, verifying password...`);
                        try {
                            // Direct comparison using bcryptjs to bypass any Mongoose method issues
                            const isPasswordMatch = await compare(credentials.password, admin.password);
                            console.log(`[AUTH][${now}] Admin password direct verification result: ${isPasswordMatch}`);
                            
                            if (!isPasswordMatch) {
                                console.log(`[AUTH][${now}] Admin password mismatch, updating via direct DB update (bypassing hooks)...`);
                                const salt = await genSalt(10);
                                const hashed = await hash(credentials.password, salt);
                                await User.updateOne(
                                    { _id: admin._id },
                                    { $set: { password: hashed } }
                                );
                                console.log(`[AUTH][${now}] Admin password force-updated in DB`);
                            } else {
                                console.log(`[AUTH][${now}] Admin password verified successfully`);
                            }
                        } catch (err) {
                            console.error(`[AUTH][${now}] Error during admin password process:`, err);
                            // Fallback: If save() or compare() failed due to some weirdness, 
                            // we just trust the hardcoded credentials for the admin block.
                        }
                    }
                    
                    return {
                        id: admin._id.toString(),
                        name: admin.name,
                        email: admin.email,
                        role: admin.role
                    };
                }

                console.log(`[AUTH][${now}] Regular user path for: ${credentials.email}`);
                const user = await User.findOne({ email: credentials.email.toLowerCase().trim() }).select('+password');

                if (!user) {
                    console.log(`[AUTH][${now}] User not found: ${credentials.email}`);
                    return null;
                }

                try {
                    const isPasswordMatch = await compare(credentials.password, user.password);
                    console.log(`[AUTH][${now}] Password verification for ${credentials.email}: ${isPasswordMatch}`);

                    if (!isPasswordMatch) {
                        return null;
                    }
                } catch (bcryptErr) {
                    console.error(`[AUTH][${now}] Bcrypt error for ${credentials.email}:`, bcryptErr);
                    return null;
                }

                console.log(`[AUTH][${now}] Login successful for: ${credentials.email}`);

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            } catch (error) {
                const nowError = new Date().toISOString();
                console.error(`[AUTH][${nowError}] CRITICAL ERROR in authorize:`, error);
                return null;
            }
        }
    })
],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role?: string }).role;
                token.id = (user as { id?: string }).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { role?: string; id?: string }).role = token.role as string;
                (session.user as { role?: string; id?: string }).id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_now",
});

export { handler as GET, handler as POST };