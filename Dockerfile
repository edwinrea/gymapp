FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente (excluyendo backend)
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para desarrollo con Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
