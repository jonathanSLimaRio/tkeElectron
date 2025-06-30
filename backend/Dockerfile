FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências do sistema
RUN apt-get update && apt-get install -y default-mysql-client

# Instala todas as dependências, incluindo @prisma/client e prisma
RUN npm install

# Instala PM2 globalmente
RUN npm install -g pm2

# Copia o restante da aplicação
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto TypeScript
RUN npm run build

# Garante permissão de execução no script de entrada
RUN chmod +x entrypoint.sh

# Expõe a porta do backend
EXPOSE 3000

# Executa o script de entrada com PM2
CMD ["./entrypoint.sh"]
