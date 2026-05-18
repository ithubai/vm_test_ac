-- CreateEnum
CREATE TYPE "Ruolo" AS ENUM ('ADMIN', 'COMMERCIALE');

-- CreateEnum
CREATE TYPE "TipoPrezzo" AS ENUM ('COSTO', 'VENDITA');

-- CreateEnum
CREATE TYPE "StatoOfferta" AS ENUM ('BOZZA', 'INVIATA', 'APPROVATA', 'ANNULLATA');

-- CreateTable
CREATE TABLE "Utente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "ruolo" "Ruolo" NOT NULL DEFAULT 'COMMERCIALE',
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articolo" (
    "id" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "tipologia" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "finitura" TEXT NOT NULL,
    "immagine" TEXT,
    "attivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Articolo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listino" (
    "id" TEXT NOT NULL,
    "articoloId" TEXT NOT NULL,
    "prezzoBase" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoPrezzo" NOT NULL DEFAULT 'VENDITA',
    "validoDal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Listino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkupConfig" (
    "id" TEXT NOT NULL,
    "categoria" TEXT,
    "markup" DOUBLE PRECISION NOT NULL,
    "attivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MarkupConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropostaTemplate" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "righe" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PropostaTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offerta" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "dataOfferta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteInterne" TEXT,
    "stato" "StatoOfferta" NOT NULL DEFAULT 'BOZZA',
    "utenteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RigaOfferta" (
    "id" TEXT NOT NULL,
    "offertaId" TEXT NOT NULL,
    "articoloId" TEXT,
    "ordine" INTEGER NOT NULL,
    "quantita" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "prezzoUnitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraMarkup" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "RigaOfferta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Articolo_codice_key" ON "Articolo"("codice");

-- CreateIndex
CREATE UNIQUE INDEX "Offerta_numero_key" ON "Offerta"("numero");

-- AddForeignKey
ALTER TABLE "Listino" ADD CONSTRAINT "Listino_articoloId_fkey" FOREIGN KEY ("articoloId") REFERENCES "Articolo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offerta" ADD CONSTRAINT "Offerta_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RigaOfferta" ADD CONSTRAINT "RigaOfferta_offertaId_fkey" FOREIGN KEY ("offertaId") REFERENCES "Offerta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RigaOfferta" ADD CONSTRAINT "RigaOfferta_articoloId_fkey" FOREIGN KEY ("articoloId") REFERENCES "Articolo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
