# Configuratore di Offerte

Web app per la creazione e gestione di offerte commerciali.

## Stack

- **Frontend/Backend**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: NextAuth.js v5
- **UI**: Tailwind CSS
- **Cache**: Redis 7
- **Deploy**: Docker Compose

## Avvio rapido (sviluppo)

```bash
# 1. Avvia il database
docker compose up db redis -d

# 2. Installa dipendenze
cd app && pnpm install

# 3. Configura variabili d'ambiente
cp .env.example .env

# 4. Crea le tabelle del database
pnpm prisma migrate dev --name init

# 5. Avvia il server di sviluppo
pnpm dev
```

L'app sarà disponibile su [http://localhost:3000](http://localhost:3000).

## Deploy con Docker

```bash
docker compose up --build -d
```

## Struttura del progetto

```
.
├── docker-compose.yml
└── app/
    ├── src/
    │   └── app/          # Next.js App Router
    ├── prisma/
    │   └── schema.prisma # Modelli DB (Cliente, Prodotto, Offerta)
    ├── Dockerfile
    └── .env.example
```

## Modelli del database

- **Cliente** — anagrafica clienti
- **Prodotto** — catalogo prodotti con prezzi
- **Offerta** — offerta commerciale (stati: BOZZA → INVIATA → ACCETTATA/RIFIUTATA)
- **RigaOfferta** — righe prodotto all'interno di un'offerta
