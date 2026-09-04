import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

// Matcher dikosongkan = middleware tidak menghalangi route manapun.
// Untuk mengaktifkan proteksi lagi, kembalikan ke: ['/admin/:path*']
export const config = {
  matcher: [],
}
