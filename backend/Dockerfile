FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies first to keep Docker layer caching useful.
COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

EXPOSE 5000
CMD ["node", "src/server.js"]
