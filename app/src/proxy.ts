import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const ruolo = req.auth?.user?.ruolo

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin") && ruolo !== "ADMIN") {
    return NextResponse.redirect(new URL("/app/offerte", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
}
