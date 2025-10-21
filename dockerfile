# Etapa 1: Construcción
FROM node:20-alpine AS build

# Crear directorio de la app
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar todo el código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servidor de producción (usando nginx)
FROM nginx:alpine

# Copiar el build de Vite a nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Remover configuración default y exponer el puerto 5000
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]
