import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar nomeUtente={session.user.name ?? ""} ruolo={session.user.ruolo} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
