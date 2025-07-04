FROM node:20

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install system dependencies (e.g., MySQL client)
RUN apt-get update && apt-get install -y default-mysql-client dos2unix

# Install Node.js dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application
COPY . .

# Convert entrypoint.sh to Unix format and make it executable
RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose application port
EXPOSE 3000

# Run the application using PM2 and entrypoint
ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
