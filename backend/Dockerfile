FROM oven/bun:alpine
WORKDIR /app

# Copy package manifest(s) for caching
COPY package.json bun.lockb* package-lock.json* ./

# Install production dependencies with Bun
RUN bun install --production

# Copy application source
COPY . .

EXPOSE 3000

# Start the app using the npm script (runs under Bun)
CMD ["bun", "run", "start"]



