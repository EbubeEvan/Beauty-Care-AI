import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;

      // Server actions expect a specific RSC response shape.
      // Redirecting them from middleware causes "unexpected response" runtime errors.
      const isServerActionRequest = request.headers.get('next-action') !== null;
      if (isServerActionRequest) {
        return true;
      }

      const authPages = ['/chat', '/buy-credits', '/profile'];
      const isAuthPage = authPages.some((page) => nextUrl.pathname.startsWith(page));

      if (isAuthPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/chat', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
};
