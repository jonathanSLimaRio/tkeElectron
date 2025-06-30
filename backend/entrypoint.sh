#!/bin/bash

set -e

echo "🔄 Aguardando o banco de dados MySQL ficar disponível..."

# Espera ativa pelo MySQL na rede docker (via nome do serviço 'mysql')
until mysqladmin ping -hmysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent; do
  echo "⏳ Aguardando MySQL..."
  sleep 2
done

echo "📦 Aplicando migrations com Prisma (migrate deploy)..."
npx prisma migrate deploy

echo "🚀 Iniciando via pm2-runtime no ambiente de produção..."
pm2-runtime ecosystem.config.js --env production
