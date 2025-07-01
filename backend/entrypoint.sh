#!/bin/bash

set -e

echo "🔄 Waiting for MySQL database to become available..."

: "${MYSQL_HOST:=mysql}"
: "${MYSQL_USER:=user}"
: "${MYSQL_PASSWORD:=password}"

until mysqladmin ping -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent; do
  echo "⏳ Waiting for MySQL..."
  sleep 2
done

# If no migrations exist yet, create the first one
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations)" ]; then
  echo "📁 No migrations found. Generating and applying initial migration..."
  npx prisma migrate dev --name init
else
  echo "📦 Applying existing migrations with migrate deploy..."
  npx prisma migrate deploy
fi

echo "🚀 Starting application via pm2-runtime in production environment..."
pm2-runtime ecosystem.config.js --env production
