import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.ruolo !== "ADMIN") redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar nomeUtente={session.user.name ?? ""} />
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  )
}
