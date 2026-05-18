import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import "dotenv/config"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  // Utenti
  await prisma.utente.upsert({
    where: { email: "admin@arcansas.it" },
    update: {},
    create: {
      nome: "Admin",
      email: "admin@arcansas.it",
      passwordHash: await bcrypt.hash("admin123", 12),
      ruolo: "ADMIN",
    },
  })

  await prisma.utente.upsert({
    where: { email: "mario@arcansas.it" },
    update: {},
    create: {
      nome: "Mario Rossi",
      email: "mario@arcansas.it",
      passwordHash: await bcrypt.hash("pass123", 12),
      ruolo: "COMMERCIALE",
    },
  })

  // Articoli + Listino
  const articoli = [
    { codice: "ART001", descrizione: "Profilo alluminio 20x20", tipologia: "Profilo", categoria: "Strutturale", finitura: "Naturale", prezzo: 12.50 },
    { codice: "ART002", descrizione: "Profilo alluminio 30x30", tipologia: "Profilo", categoria: "Strutturale", finitura: "Anodizzato", prezzo: 18.00 },
    { codice: "ART003", descrizione: "Piastra di giunzione 40x40", tipologia: "Accessorio", categoria: "Connettori", finitura: "Grezzo", prezzo: 5.50 },
    { codice: "ART004", descrizione: "Vite M6x12 testa cilindrica", tipologia: "Viteria", categoria: "Fissaggi", finitura: "Zincato", prezzo: 0.25 },
    { codice: "ART005", descrizione: "Angolare 90° 40x40", tipologia: "Accessorio", categoria: "Connettori", finitura: "Naturale", prezzo: 8.00 },
  ]

  for (const art of articoli) {
    const articolo = await prisma.articolo.upsert({
      where: { codice: art.codice },
      update: { descrizione: art.descrizione, tipologia: art.tipologia, categoria: art.categoria, finitura: art.finitura },
      create: { codice: art.codice, descrizione: art.descrizione, tipologia: art.tipologia, categoria: art.categoria, finitura: art.finitura },
    })

    const existing = await prisma.listino.findFirst({
      where: { articoloId: articolo.id, attivo: true, tipo: "VENDITA" },
    })
    if (!existing) {
      await prisma.listino.create({
        data: { articoloId: articolo.id, prezzoBase: art.prezzo, tipo: "VENDITA", attivo: true },
      })
    }
  }

  // Markup globale
  const existingMarkup = await prisma.markupConfig.findFirst({ where: { categoria: null, attivo: true } })
  if (!existingMarkup) {
    await prisma.markupConfig.create({ data: { markup: 30.0, attivo: true } })
  }

  // Proposta template
  const existingTemplate = await prisma.propostaTemplate.findFirst({ where: { nome: "Struttura Base" } })
  if (!existingTemplate) {
    await prisma.propostaTemplate.create({
      data: {
        nome: "Struttura Base",
        descrizione: "Template standard per strutture in alluminio",
        righe: [
          { codice: "ART001", descrizione: "Profilo alluminio 20x20", quantita: 4 },
          { codice: "ART002", descrizione: "Profilo alluminio 30x30", quantita: 2 },
          { codice: "ART003", descrizione: "Piastra di giunzione 40x40", quantita: 8 },
        ],
        attivo: true,
      },
    })
  }

  console.log("Seed completato con successo")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
