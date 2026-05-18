"use client"

import { signOut } from "next-auth/react"

interface NavbarProps {
  nomeUtente: string
  ruolo: string
}

export default function Navbar({ nomeUtente, ruolo }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-gray-800">Arcansas — Offerte</span>
        <a href="/app/offerte" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
          Le mie offerte
        </a>
        {ruolo === "ADMIN" && (
          <a href="/admin/utenti" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Admin
          </a>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{nomeUtente}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Esci
        </button>
      </div>
    </nav>
  )
}
