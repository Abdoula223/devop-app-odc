FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
# ⚠️ IMPORTANT : Utilise node directement, pas nodemon
CMD ["node", "app.js"]
