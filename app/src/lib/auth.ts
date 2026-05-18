import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const utente = await prisma.utente.findUnique({
          where: { email: credentials.email as string },
        })

        if (!utente || !utente.attivo) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          utente.passwordHash
        )
        if (!valid) return null

        return {
          id: utente.id,
          name: utente.nome,
          email: utente.email,
          ruolo: utente.ruolo,
        }
      },
    }),
  ],
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
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
})
