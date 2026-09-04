// src/middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // hanya cek sudah login; detail permission dicek di tiap service/route
  },
})

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/media/:path*'],
}