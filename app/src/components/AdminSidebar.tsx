"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const voci = [
  { href: "/admin/utenti", label: "Utenti" },
  { href: "/admin/listino", label: "Listino" },
  { href: "/admin/markup", label: "Markup" },
  { href: "/admin/template", label: "Template" },
]

export default function AdminSidebar({ nomeUtente }: { nomeUtente: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-5 py-4 border-b border-gray-700">
        <span className="font-bold text-white">Arcansas Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {voci.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith(v.href)
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">{nomeUtente}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Esci
        </button>
      </div>
    </aside>
  )
}
