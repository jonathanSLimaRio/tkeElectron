echo "🔄 Aguardando banco..."
sleep 5

echo "📦 Migrando o banco (prisma migrate deploy)..."
npx prisma migrate deploy

echo "🚀 Iniciando via pm2-runtime..."
# pm2-runtime lê o ecosystem.config.js e roda no modo "production"
pm2-runtime ecosystem.config.js --env production
