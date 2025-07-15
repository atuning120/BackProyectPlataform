# Imagen base liviana
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de dependencias primero
COPY package*.json ./

# Instala dependencias (solo producción si no necesitas devDependencies)
RUN npm install --production

# Copia el resto del código
COPY . .

# Expone el puerto del backend
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]
