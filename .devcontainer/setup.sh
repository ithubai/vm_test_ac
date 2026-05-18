#!/bin/bash
set -e

echo "🔧 Avvio PostgreSQL..."
sudo service postgresql start

echo "🗄️  Creazione utente e database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='offerte'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER offerte WITH PASSWORD 'offerte_secret';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='offerte_db'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE offerte_db OWNER offerte;"

echo "⚙️  Configurazione variabili ambiente..."
cd /workspaces/vm_test_ac/app
[ -f .env ] || cp .env.example .env

echo "📦  Installazione dipendenze..."
pnpm install

echo "🔄  Migrazione database..."
pnpm exec prisma migrate deploy

echo "🌱  Seed database..."
pnpm exec prisma db seed

echo ""
echo "✅ Setup completato! Avvia l'app con: pnpm dev"
