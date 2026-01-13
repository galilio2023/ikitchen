import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 🚀 THE BYPASS: No DB needed for this check
                if (credentials?.email === 'ibrahimgalal2011@gmail.com') {
                    return {
                        id: "admin-static",
                        name: "Ibrahim Admin",
                        email: "ibrahimgalal2011@gmail.com",
                        role: "admin"
                    };
                }

                // Everything below this line is ignored for your email
                return null;
            }
        })
    ],
    // ... keep your existing callbacks and secret below
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_now",
});

export { handler as GET, handler as POST };