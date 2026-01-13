import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 2. Credentials Provider Patch
                try {
                    // Admin Bypass
                    if (credentials?.email === 'ibrahimgalal2011@gmail.com') {
                        return { 
                            id: "admin-id", 
                            name: "Ibrahim Galal", 
                            email: "ibrahimgalal2011@gmail.com",
                            role: "admin"
                        };
                    }

                    await dbConnect();
                    // In a real app, you'd check the DB here
                    // const user = await User.findOne({ email: credentials?.email });
                    // if (user && compare(credentials.password, user.password)) return user;
                    
                    return null;
                } catch (error) {
                    console.error("AUTH_DATABASE_HANDSHAKE_FAILURE:", error);
                    // Fallback for Admin during DB failure
                    if (credentials?.email === 'ibrahimgalal2011@gmail.com') {
                        return { 
                            id: "admin-id-fallback", 
                            name: "Ibrahim Galal", 
                            email: "ibrahimgalal2011@gmail.com",
                            role: "admin"
                        };
                    }
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                // 3. Admin Seed & Session (Injecting role)
                if (user.email === 'ibrahimgalal2011@gmail.com') {
                    token.role = 'admin';
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
                
                // 3. Admin Seed & Session (Manual injection)
                if (session.user.email === 'ibrahimgalal2011@gmail.com') {
                    (session.user as any).role = 'admin';
                }
            }
            return session;
        }
    },
    // 1. Fix the Route Export (explicit secret)
    secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
