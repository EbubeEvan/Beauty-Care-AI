import type { NextAuthConfig } from 'next-auth';
 
export const authConfig : NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const authPages = ['/chat', '/buy-credits', '/profile'];
      const isAuthPage = authPages.some(page => nextUrl.pathname.startsWith(page));

      const isOnChat = nextUrl.pathname.startsWith('/chat');
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