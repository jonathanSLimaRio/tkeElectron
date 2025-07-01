FROM node:20

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências do sistema
RUN apt-get update && apt-get install -y default-mysql-client

# Instala dependências do Node.js
RUN npm install

# Instala PM2 globalmente
RUN npm install -g pm2

# Copia todo o restante da aplicação
COPY . .

# Gera Prisma Client (depois de copiar tudo, pois depende de schema)
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# Torna o script de entrada executável
RUN chmod +x entrypoint.sh

EXPOSE 3000

# Usa PM2 com o entrypoint
CMD ["./entrypoint.sh"]
