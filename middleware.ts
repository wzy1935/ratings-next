import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';


export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (auth.isPublicRoute) return NextResponse.next()
    if (auth.userId !== null) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/sign-in', req.url))
  },
  publicRoutes: ['/', '/sign-in', '/sign-up', '/board']
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/(api|trpc)(.*)',
  ],
};
