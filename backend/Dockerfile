FROM node:18-alpine
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --production || true

# Copy source
COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]
