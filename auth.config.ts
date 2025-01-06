import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        // by adding signIn: '/login' into our pages option, the user will be redirected to our custom login page, rather than the NextAuth.js default page.
        signIn: "/login",
    },
    callbacks: {
        // prevent users from accessing the dashboard pages unless they are logged in
        /**
         * authorized 메서드:
         * used to verify if the request is authorized to access a page via Next.js Middleware.
         * called before a request is completed,
         * and it receives an object with 'auth' and 'request' properties.
         * 'auth': contains the user's session
         * 'request': contains the incoming request
         */
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
    /**
     * providers:
     * an array where you list different login options.
     */
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
