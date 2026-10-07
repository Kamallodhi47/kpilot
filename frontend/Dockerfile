# Stage 1: React app build karna
FROM node:18-alpine AS build

WORKDIR /app

# Dependencies install karna
COPY package*.json ./
RUN npm install

# Pura code copy karna
COPY . .

# App ko production ke liye build karna
RUN npm run build

# Stage 2: Nginx se app ko serve karna (Fast & Secure)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 expose karna
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
