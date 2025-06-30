FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --production

RUN npm install -g pm2

COPY . .
RUN npm run build

RUN chmod +x entrypoint.sh

EXPOSE 3000

# Inicia o container executando o script de entrada
CMD ["./entrypoint.sh"]