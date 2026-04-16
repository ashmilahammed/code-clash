# ===== BUILD STAGE =====
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM node:20

WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/main.js"]
