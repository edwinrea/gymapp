FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Crear directorio para la base de datos
RUN mkdir -p data

# Exponer el puerto 3001
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["node", "server.js"]