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
                // MOVE BYPASS HERE: Before dbConnect() to prevent the hang
                if (credentials?.email === 'ibrahimgalal2011@gmail.com') {
                    return {
                        id: "admin-id",
                        name: "Ibrahim Galal",
                        email: "ibrahimgalal2011@gmail.com",
                        role: "admin"
                    };
                }

                try {
                    await dbConnect();
                    // Database logic goes here later...
                    return null;
                } catch (error) {
                    console.error("DB_ERROR:", error);
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
                token.role = (user as any).role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    // FIX: Vercel prefers NEXTAUTH_SECRET
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };