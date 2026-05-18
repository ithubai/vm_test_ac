import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.ruolo = (user as { ruolo: string }).ruolo
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.ruolo = token.ruolo as "ADMIN" | "COMMERCIALE"
      return session
    },
  },
  providers: [],
}
