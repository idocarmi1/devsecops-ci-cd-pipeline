FROM node:22-alpine AS build
WORKDIR /app

# Build the static React assets in a dedicated stage.
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# Nginx serves the static frontend and proxies /api traffic to the backend service.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
