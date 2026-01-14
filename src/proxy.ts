import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    // We use a more explicit negative lookahead for Vercel
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|login|manifest.json).*)",
    ],
};