# backend/Dockerfile
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Expone el puerto del backend
EXPOSE 5000

# Comando por defecto
CMD ["npm", "start"]
