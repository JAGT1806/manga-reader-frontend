# Etapa 1: Construcción de la aplicación Angular
FROM node:20 as build

WORKDIR /app

# Copiar y descargar las dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación con soporte para localización
RUN npm run build -- --localize

# Etapa 2: Servidor Nginx para servir los archivos
FROM nginx:stable

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos compilados de Angular
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
