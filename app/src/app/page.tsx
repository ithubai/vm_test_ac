import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.ruolo === "ADMIN") redirect("/admin/utenti")
  redirect("/app/offerte")
}
