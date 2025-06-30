FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência primeiro (melhora o cache do Docker)
COPY package*.json ./

# Instala dependências do sistema (incluindo mysql-client)
RUN apt-get update && apt-get install -y default-mysql-client

# Instala dependências da aplicação
RUN npm install --production

# Instala PM2 globalmente
RUN npm install -g pm2

# Copia os arquivos da aplicação para o container
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Garante permissão de execução no script de entrada
RUN chmod +x entrypoint.sh

# Expõe a porta do backend
EXPOSE 3000

# Inicia o container executando o script de entrada
CMD ["./entrypoint.sh"]